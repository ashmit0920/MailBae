from google import genai
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

API_KEY = os.getenv("API_KEY")


class EmailReply(BaseModel):
    category: str
    reply: str


class Summary(BaseModel):
    category: str
    points: list[str]


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
    Keep one sentence for each email (or one sentence for each sender if there are multiple emails from the same sender and could be clubbed together).
    Additionally, after summarizing categorize each sentence into a category like "Work", "Promotional", "Newsletter", "Personal". Stick to these 4 categories only, in case there are no emails belonging to one of these categories then you can simply leave it.
    
    OUTPUT FORMAT:
    **STRICTLY RETURN A JSON WITH EACH OBJECT HAVING 2 KEYS - "category" AND "points". The value of "points" should be a list of one-sentence summaries that you wrote, each representing an email from that particular category.**
    MAKE SURE THAT EACH CATEGORY KEY APPEARS ONLY ONCE (AT MAX) IN THE JSON - meaning that all emails belonging to the same category are grouped together in one single JSON object.
    Do not create multiple separate objects for the same category.
    Each object in the final output should have a unique category field and an associated list of bullet points under the points array.


    Sample JSON Output (the sentences could be longer, this is just an example):

    [
        {{
            "category": "Work",
            "points": [
            "You received a report from the finance team.",
            "Client X scheduled a meeting for tomorrow.",
            "GitHub Actions failed on build step."
            ]
        }},
        {{
            "category": "Promotional",
            "points": [
            "New job opportunities at multiple companies, apply now at jobboard.com.",
            "Spotify is offering 3 months of premium for $5."
            ]
        }}
    ]


    Below are the emails in JSON format:
    ---
    {EMAILS}
    ---
    """

    res = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt, config={
            "response_mime_type": "application/json",
            "response_schema": list[Summary],
        })

    return res.text
