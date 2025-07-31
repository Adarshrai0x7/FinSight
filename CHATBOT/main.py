from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_chain import qa_chain  # This is your function
from langchain.schema import Document

app = FastAPI()

# ✅ Allow frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageInput(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(input: MessageInput):
    try:
        user_message = input.message.strip().lower()

        # ✅ Step 1: Let qa_chain handle everything
        response = qa_chain(user_message)

        return {"reply": response}

    except Exception as e:
        return {"error": str(e)}
