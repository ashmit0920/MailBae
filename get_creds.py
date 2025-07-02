import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
# Your env values
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']


def get_credentials(user_email: str) -> Credentials:
    # Fetch token data from Supabase
    response = supabase \
        .from_('gmail_tokens') \
        .select('*') \
        .eq('user_email', user_email) \
        .single()

    if response.get('error'):
        raise Exception(
            f"Failed to fetch Gmail token: {response['error']['message']}")

    token_data = response['data']
    if not token_data:
        raise Exception("No token found for this user.")

    creds = Credentials(
        token=token_data['access_token'],
        refresh_token=token_data['refresh_token'],
        token_uri='https://oauth2.googleapis.com/token',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        scopes=SCOPES
    )

    # Refresh if expired
    if not creds.valid and creds.expired and creds.refresh_token:
        creds.refresh(Request())

        # Optionally update the new access_token and expiry in Supabase
        supabase.from_('gmail_tokens').update({
            'access_token': creds.token,
            'expires_at': creds.expiry.isoformat() if creds.expiry else None
        }).eq('user_email', user_email).execute()

    return creds
