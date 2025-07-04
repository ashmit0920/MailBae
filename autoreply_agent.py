from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

# New imports for Gmail API
from googleapiclient.discovery import build
from get_creds import get_credentials
from email_handler import build_gmail_query, get_body_from_payload


load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")

model = init_chat_model("gemini-2.0-flash", model_provider="google_genai")

# Classification prompt: yes/no
classification_prompt = PromptTemplate.from_template("""You are an email triage assistant.  
Decide if the following email NEEDS a reply (YES/NO).

Subject: {subject}

Body:
{body}

Answer in the format:
NEEDS_REPLY: YES or NO
REASON: <brief rationale>
""",
                                                     )

classify_chain = classification_prompt | model | StrOutputParser()


# Drafting prompt
draft_prompt = PromptTemplate.from_template("""You are a helpful email assistant that drafts professional replies.
Avoid jargon and use simple, human language and natural tone.
Here is an incoming email:

Subject: {subject}

Body:
{body}

Write a concise but friendly reply, addressing the sender's points.
""",
                                            )

draft_chain = draft_prompt | model | StrOutputParser()


def process_email(subject: str, body: str) -> dict:
    # 1) Classify
    cls = classify_chain.invoke({"subject": subject, "body": body})
    needs = "YES" if "YES" in cls.split("NEEDS_REPLY:")[1] else "NO"

    result = {
        "needs_reply": needs == "YES",
        "classification_rationale": cls.split("REASON:")[1],
        "draft": None,
    }

    # 2) If it needs a reply, generate one
    if result["needs_reply"]:
        draft = draft_chain.invoke({"subject": subject, "body": body})
        result["draft"] = draft.strip()

    return result


def fetch_emails(user_email, timezone, since_hour=9, max_results=5):
    """Fetches recent emails from Gmail."""
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


def main():
    # NOTE: In a real application, you would not hardcode these values.
    # You might get them from a config file, a database, or command-line arguments.

    # IMPORTANT: Replace with a valid email address
    user_email = "athawait_be22@thapar.edu"
    timezone = "Asia/Calcutta"      # IMPORTANT: Replace with your timezone

    print(f"Fetching emails for {user_email} in timezone {timezone}...")
    emails = fetch_emails(user_email, timezone)

    if not emails:
        print("No new emails to process.")
        return

    print(f"\nFound {len(emails)} emails to process.\n")

    for email in emails:
        print("="*50)
        print(f"Processing email from: {email['from']}")
        # print(f"Subject: {email['subject']}")

        # Use the existing agent to process the email
        result = process_email(subject=email['subject'], body=email['body'])

        print("\n--- Classification ---")
        print(f"Needs Reply: {result['needs_reply']}")
        print(f"Rationale: {result['classification_rationale'].strip()}")

        if result['needs_reply']:
            print("\n--- Drafted Reply ---")
            print(result['draft'])
        else:
            print("\nNo reply needed.")
        print("="*50)


if __name__ == "__main__":
    main()
