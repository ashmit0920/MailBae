import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

from googleapiclient.discovery import build
from get_creds import get_credentials
from email_handler import build_gmail_query, get_body_from_payload


load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")

model = init_chat_model("gemini-2.0-flash", model_provider="google_genai")

# Classification prompt: yes/no
classification_prompt = PromptTemplate.from_template("""You are an email triage assistant.
You will receive a JSON array of email objects. For each email, decide if it NEEDS a reply (YES/NO).

Input Emails (JSON):
{emails_json}

Output your response as a JSON array. Each object in the array should correspond to an input email and include its 'id', 'needs_reply' (boolean: true if YES, false if NO), and 'reason' (string: brief rationale).
DO NOT WRAP THE OUTPUT IN CODE BLOCKS LIKE ```json. Simply return the JSON array in a text/string format.

Example Output:
[
  {{
    "id": "email_id_1",
    "from": "sender_1",
    "needs_reply": true,
    "reason": "The sender is asking a direct question."
  }},
  {{
    "id": "email_id_2",
    "from": "sender_2",
    "needs_reply": false,
    "reason": "This is an automated notification."
  }}
]
""",
                                                     )

classify_chain = classification_prompt | model | StrOutputParser()


# Drafting prompt
draft_prompt = PromptTemplate.from_template("""You are a helpful email assistant that drafts professional replies.
Avoid jargon and use simple, human language and natural tone.
You will receive a JSON array of email objects that require a reply. For each email, draft a concise but friendly reply, addressing the sender's points.

Input Emails (JSON):
{emails_to_draft_json}

Output your response as a JSON array. Each object in the array should correspond to an input email and include its 'id' and 'draft' (string: the drafted reply).
DO NOT WRAP THE OUTPUT IN CODE BLOCKS LIKE ```json. Simply return the JSON array in a text/string format.

Example Output:
[
  {{
    "id": "email_id_1",
    "draft": "Hi [Sender Name], Thanks for your email. I'll look into this and get back to you soon."
  }},
  {{
    "id": "email_id_3",
    "draft": "Hello, I've received your request and will process it shortly."
  }}
]
""",
                                            )

draft_chain = draft_prompt | model | StrOutputParser()


def process_email(emails: list[dict]) -> dict:
    """
    Processes a list of emails in a batch for classification and drafting.
    Args:
        emails: A list of dictionaries, where each dictionary represents an email
                and must contain 'id', 'subject', and 'body' keys.
    Returns:
        A dictionary where keys are email IDs and values are dictionaries
        containing 'needs_reply', 'classification_rationale', and 'draft' (if any).
    """
    if not emails:
        return {}

    # Prepare emails for classification
    emails_for_classification = []
    for email in emails:
        emails_for_classification.append({
            "id": email['id'],
            "from": email['from'],
            "subject": email['subject'],
            "body": email['body']
        })
    emails_json_str = json.dumps(emails_for_classification)

    # 1) Classify all emails in batch
    classification_raw_output = classify_chain.invoke(
        {"emails_json": emails_json_str})

    cleaned_classification_output = classification_raw_output.strip()
    if cleaned_classification_output.startswith("```json") and cleaned_classification_output.endswith("```"):
        cleaned_classification_output = cleaned_classification_output[len(
            "```json"):-len("```")].strip()

    try:
        classified_results = json.loads(cleaned_classification_output)
    except json.JSONDecodeError as e:
        print(
            f"Error decoding classification JSON: {cleaned_classification_output} \n{repr(e)}")
        # Fallback or error handling: assume no replies needed if parsing fails
        return {email['id']: {"needs_reply": False, "classification_rationale": "JSON parsing failed", "draft": None} for email in emails}

    # Map classified results by ID for easy lookup
    classified_map = {res['id']: res for res in classified_results}

    # Prepare results structure
    final_results = {email['id']: {
        "sender": classified_map.get(email['id'], {}).get('from', 'Unknown Sender'),
        "needs_reply": classified_map.get(email['id'], {}).get('needs_reply', False),
        "classification_rationale": classified_map.get(email['id'], {}).get('reason', 'No rationale provided'),
        "draft": None,
    } for email in emails}

    # Identify emails that need a reply for drafting
    emails_to_draft = []
    for email in emails:
        if final_results[email['id']]['needs_reply']:
            emails_to_draft.append({
                "id": email['id'],
                "from": email['from'],
                "subject": email['subject'],
                "body": email['body']
            })

    # 2) If any emails need a reply, generate drafts in batch
    if emails_to_draft:
        emails_to_draft_json_str = json.dumps(emails_to_draft)

        drafting_raw_output = draft_chain.invoke(
            {"emails_to_draft_json": emails_to_draft_json_str})

        # Clean the output by removing markdown code block wrappers
        cleaned_drafting_output = drafting_raw_output.strip()
        if cleaned_drafting_output.startswith("```json") and cleaned_drafting_output.endswith("```"):
            cleaned_drafting_output = cleaned_drafting_output[len(
                "```json"):-len("```")].strip()

        try:
            drafted_results = json.loads(cleaned_drafting_output)
        except json.JSONDecodeError:
            print(f"Error decoding drafting JSON: {cleaned_drafting_output}")
            # Continue without drafts if parsing fails
            drafted_results = []

        # Map drafted results by ID
        drafted_map = {res['id']: res for res in drafted_results}

        # Update final results with drafts
        for email_id, result_data in final_results.items():
            if result_data['needs_reply'] and email_id in drafted_map:
                final_results[email_id]['draft'] = drafted_map[email_id]['draft'].strip(
                )

    return final_results


def fetch_emails(user_email, timezone, since_hour=9, max_results=100):

    creds = get_credentials(user_email)
    if not creds:
        print("Could not get credentials. Please check your setup.")
        return []
    service = build('gmail', 'v1', credentials=creds)

    query = build_gmail_query(timezone, since_hour)

    try:
        results = service.users().messages().list(
            userId='me', q=query, maxResults=max_results).execute()
        messages = results.get('messages', [])
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return []

    emails_data = []
    if not messages:
        return emails_data

    for msg in messages:
        msg_data = service.users().messages().get(
            userId='me', id=msg['id'], format='full').execute()
        headers = msg_data['payload'].get('headers', [])
        subject = next((h['value']
                       for h in headers if h['name'] == 'Subject'), 'No Subject')
        sender = next((h['value'] for h in headers if h['name']
                      == 'From'), 'Unknown Sender')
        body = get_body_from_payload(msg_data['payload'])

        emails_data.append({
            'id': msg['id'],
            'from': sender,
            'subject': subject,
            'body': body
        })

    return emails_data


def run_autoresponder(user_email, timezone, since_hour):

    # user_email = "athawait_be22@thapar.edu"
    # timezone = "Asia/Calcutta"
    # since_hour = 9

    print(f"Fetching emails for {user_email} in timezone {timezone}...")
    emails = fetch_emails(user_email, timezone, since_hour)

    if not emails:
        print("No new emails to process.")
        return

    print(f"Found {len(emails)} emails to process.")

    # Process all fetched emails at once
    processed_results = process_email(emails)

    return processed_results

    # for email in emails:  # Iterate through original emails to maintain order and access original 'from'
    #     email_id = email['id']
    #     result = processed_results.get(email_id)

    #     if result:
    #         print("="*50)
    #         print(f"Processing email from: {email['from']}")
    #         print(f"Subject: {email['subject']}")  # Added subject for clarity

    #         print("--- Classification - --")
    #         print(f"Needs Reply: {result['needs_reply']}")
    #         print(f"Rationale: {result['classification_rationale'].strip()}")

    #         if result['needs_reply']:
    #             print("--- Drafted Reply - --")
    #             print(result['draft'])
    #         else:
    #             print("No reply needed.")
    #         print("="*50)
    #     else:
    #         print(f"Could not find processed results for email ID: {email_id}")
