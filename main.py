import os.path
import base64
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import email
from datetime import datetime, timezone
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
    parts = payload.get("parts")

    if parts:
        for part in parts:
            if part["mimeType"] == "text/plain":
                data = part["body"]["data"]
                return base64.urlsafe_b64decode(data).decode("utf-8")
    else:
        # In case there's no multipart (some emails are simple)
        data = payload["body"].get("data")
        if data:
            return base64.urlsafe_b64decode(data).decode("utf-8")

    return "No plain text body found"


def list_messages(service):
    results = service.users().messages().list(userId='me', maxResults=5).execute()
    messages = results.get('messages', [])

    if not messages:
        print("No messages found.")
    else:
        print(f"📩 Showing latest {len(messages)} emails:\n")
        for msg in messages:
            msg_data = service.users().messages().get(
                userId='me', id=msg['id'], format='full').execute()
            headers = msg_data['payload']['headers']
            subject = next(
                (h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next(
                (h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
            snippet = msg_data.get('snippet', '')
            body = get_body_from_payload(msg_data['payload'])

            print(f"🧑 From: {sender}")
            print(f"📝 Subject: {subject}")
            print(f"💬 Snippet: {snippet}\n")
            print(f"📨 Body: {body}\n\n{'-'*50}\n\n")


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

        if body == 'No plain text body found':  # currently only plain text body
            emails_data.append({
                'from': sender,
                'subject': subject,
                'body': body
            })
        print(sender, ":", msg_data['labelIds'], end="\n")

    if emails_data:
        summary = generate_summary(emails_data)
        print("\n📬 Daily Summary:\n", summary)
        # print(emails_data)
    else:
        print("No emails found for today.")


def main():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    fetch_todays_emails_and_summarize(service)


if __name__ == '__main__':
    main()
