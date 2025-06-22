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


def generate_summary(EMAILS):
    prompt = f"""You are a smart, friendly and polite email assistant. You are being given a list of emails, in a JSON format with 3 fields for each email - 'from', 'subject' and 'body'.
    Analyze all the given emails carefully and generate a clear, concise and to-the-point summary for all these emails. Avoid jargon and use simple, human language.
    You should include ALL THE IMPORTANT and urgent points in the summary, while promotional emails could be given less importance.
    You can mention the senders for the important emails if required as well.

    **STRICTLY RETURN ONLY THE SUMMARY IN ONE PARAGRAPH AND NOTHING ELSE.** 
            
    Below are the emails in JSON format:
    ---
    {EMAILS}
    ---
    """

    res = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt)

    return res.text
