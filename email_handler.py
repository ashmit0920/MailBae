from datetime import datetime, timedelta
import pytz
import os.path
import base64
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from bs4 import BeautifulSoup

from gemini import generate_summary

# Scopes: change to 'readonly' if you just want to read
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']


def get_credentials():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'mailbae_client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds


def get_body_from_payload(payload):
    # Extracts the plain text or HTML content from an email payload.

    # Try top-level part first
    mime_type = payload.get("mimeType")
    body_data = payload.get("body", {}).get("data")

    if mime_type == "text/plain" and body_data:
        return decode_body(body_data)

    if mime_type == "text/html" and body_data:
        html_content = decode_body(body_data)
        return extract_text_from_html(html_content)

    # For multipart emails
    def extract_parts(parts):
        for part in parts:
            mime_type = part.get("mimeType")
            body_data = part.get("body", {}).get("data")

            if mime_type == "text/plain" and body_data:
                return decode_body(body_data)

            if mime_type == "text/html" and body_data:
                html_content = decode_body(body_data)
                return extract_text_from_html(html_content)

            # Recursively search nested parts (for multipart/* type emails)
            if part.get("parts"):
                result = extract_parts(part["parts"])
                if result:
                    return result

        return "[No readable body found]"

    return extract_parts(payload.get("parts", [])) or "[No readable body found]"


def decode_body(data):
    return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")


def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    text = soup.get_text(separator="\n").strip()
    lines = text.splitlines()
    # remove excess blank lines from text, just to keep it clean
    clean_lines = [line.strip() for line in lines if line.strip()]
    return "\n".join(clean_lines)


def build_gmail_query(since_hour=9):
    # Get current time in your timezone
    tz = pytz.timezone("Asia/Kolkata")
    now = datetime.now(tz)

    # Get today’s date at 9 AM
    start_time = now.replace(hour=since_hour, minute=0,
                             second=0, microsecond=0)

    # Convert to Gmail timestamp (UNIX epoch in seconds)
    after_timestamp = int(start_time.timestamp())

    # Gmail supports `after:` filter with timestamp in seconds
    return f"after:{after_timestamp}"


def no_of_emails():
    query = build_gmail_query()  # -> "after:1729813800"

    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(
        userId='me', q=query, maxResults=100).execute()

    messages = results.get('messages', [])
    print(len(messages))


def fetch_todays_emails_and_summarize(service):
    query = "in:anywhere newer_than:1d"  # Gmail query language

    results = service.users().messages().list(
        userId='me', q=query, maxResults=100).execute()
    messages = results.get('messages', [])

    emails_data = []

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
            'from': sender,
            'subject': subject,
            'body': body
        })

        # print(f"{sender} \n {body} \n\n")

    if emails_data:
        summary = generate_summary(emails_data)
        # print("\n📬 Daily Summary:\n", summary)
        return summary
        # print(emails_data)
    else:
        print("No emails found for today.")


def email_summarizer():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    summary = fetch_todays_emails_and_summarize(service)
    return summary
