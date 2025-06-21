import os.path
import base64
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import email

# Scopes: change to 'readonly' if you just want to read
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


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


def list_messages(service):
    results = service.users().messages().list(userId='me', maxResults=10).execute()
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

            print(f"🧑 From: {sender}")
            print(f"📝 Subject: {subject}")
            print(f"💬 Snippet: {snippet}\n{'-'*50}\n")


def main():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    list_messages(service)


if __name__ == '__main__':
    main()
