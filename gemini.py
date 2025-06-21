from google import genai
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

API_KEY = os.getenv("API_KEY")


class EmailReply(BaseModel):
    category: str
    reply: str


client = genai.Client(api_key=API_KEY)


def generate_reply(sender, subject, snippet, body):
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
        model="gemini-2.0-flash", contents=prompt, config={
            "response_mime_type": "application/json",
            "response_schema": list[EmailReply],
        },)

    print(res.text)
