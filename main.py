from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import uvicorn

from email_handler import email_summarizer, no_of_emails, send_message
from autoreply_agent import run_autoresponder


class EmailPayload(BaseModel):
    user_email: EmailStr
    to: EmailStr
    subject: str
    message: str


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
def summarize_emails(user_email: str = Query(...), timezone: str = Query(...), since_hour: int = Query(9)):
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


@app.post("/api/auto_respond")
def auto_respond(user_email: str = Query(...), timezone: str = Query(...), since_hour: int = Query(9)):
    try:
        result = run_autoresponder(user_email, timezone, since_hour)
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/send_email")
async def send_email(payload: EmailPayload):

    result = send_message(
        sender=payload.user_email,
        to=payload.to,
        subject=payload.subject,
        message_text=payload.message,
    )

    if not result:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"status": "success", "message_id": result["id"]}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
