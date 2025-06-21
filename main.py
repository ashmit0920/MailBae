import os.path
import base64
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google import genai
import email
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")

client = genai.Client(api_key=API_KEY)

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

            # print(f"🧑 From: {sender}")
            # print(f"📝 Subject: {subject}")
            # print(f"💬 Snippet: {snippet}\n")

            # if body != "No plain text body found":
            #     print(f"📨 Body: {body}\n\n{'-'*50}\n\n")

            prompt = f"""You are smart, friendly and polite mail assistant. Analyze an email carefully and categorize it into one of the below categories:
            1. IMPORTANT
            2. PROMOTIONAL
            3. SPAM
            4. URGENT

            STRICTLY RETURN only the category in ONE WORD and NOTHING ELSE. In case their is no body content available simply return "NO CONTENT".
            
            Below is the email content:
            ---
            From: {sender}
            Subject: {subject}
            Snippet: {snippet}
            Body: \n{body}
            ---
            """

            res = client.models.generate_content(
                model="gemini-2.0-flash", contents=prompt)

            print(res.text)


def main():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    list_messages(service)


if __name__ == '__main__':
    main()
