from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

from email_handler import email_summarizer, no_of_emails


class Email(BaseModel):
    from_: str
    subject: str
    body: str


class EmailList(BaseModel):
    emails: List[Email]


# FastAPI app
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/summarize")
def summarize_emails(user_email: str, timezone: str, since_hour: int = 9):
    try:
        summary = email_summarizer(user_email, timezone, since_hour)
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/no_of_emails")
def fetch_emails(user_email: str, timezone: str, since_hour: int = 9):
    try:
        number = no_of_emails(user_email, timezone, since_hour)
        return {"emails_received": number}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
