from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")

model = init_chat_model("gemini-2.0-flash", model_provider="google_genai")

# Classification prompt: yes/no
classification_prompt = PromptTemplate.from_template("""You are an email triage assistant.  
Decide if the following email NEEDS a reply (YES/NO).

Subject: {subject}

Body:
{body}

Answer in the format:
NEEDS_REPLY: YES or NO
REASON: <brief rationale>
""",
                                                     )

classify_chain = classification_prompt | model | StrOutputParser()


# Drafting prompt
draft_prompt = PromptTemplate.from_template("""You are a helpful email assistant that drafts professional replies.
Avoid jargon and use simple, human language and natural tone.
Here is an incoming email:

Subject: {subject}

Body:
{body}

Write a concise but friendly reply, addressing the sender's points.
""",
                                            )

draft_chain = draft_prompt | model | StrOutputParser()


def process_email(subject: str, body: str) -> dict:
    # 1) Classify
    cls = classify_chain.invoke({"subject": subject, "body": body})
    needs = "YES" if "YES" in cls.split("NEEDS_REPLY:")[1] else "NO"

    result = {
        "needs_reply": needs == "YES",
        "classification_rationale": cls.split("REASON:")[1],
        "draft": None,
    }

    # 2) If it needs a reply, generate one
    if result["needs_reply"]:
        draft = draft_chain.invoke({"subject": subject, "body": body})
        result["draft"] = draft.strip()

    return result


sample_email = {
    "subject": "Quick sync on the Q3 roadmap?",
    "body": """
Hi Ashmit,

Can we schedule a 15-minute sync tomorrow morning to review the Q3 roadmap and milestones?

Thanks,
Jane
""",
}

# print(process_email(**sample_email))

out = process_email(**sample_email)

print("=== Classification ===")
print(out["classification_rationale"])

if out["needs_reply"]:
    print("\n=== Drafted Reply ===")
    print(out["draft"])
else:
    print("\nNo reply needed.")
