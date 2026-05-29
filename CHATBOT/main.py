from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from rag_chain import qa_chain
import uuid

app = FastAPI(title="FBOT Chatbot API", version="1.0.0")

# ── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory conversation history (session_id -> list of messages) ────────
# Each message: {"role": "user"|"assistant", "content": str}
conversation_store: dict[str, list[dict]] = {}
MAX_HISTORY = 10  # keep last 10 turns (5 user + 5 assistant)

class MessageInput(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="User message")
    session_id: str = Field(default="", description="Session ID to maintain conversation history")

class ChatResponse(BaseModel):
    reply: str
    session_id: str

# ── Health endpoint ─────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "FBOT Chatbot API", "version": "1.0.0"}

# ── Chat endpoint ───────────────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(input: MessageInput):
    try:
        # Create or retrieve session
        session_id = input.session_id.strip() or str(uuid.uuid4())
        if session_id not in conversation_store:
            conversation_store[session_id] = []

        history = conversation_store[session_id]

        # Build context string from recent history
        context = ""
        if history:
            context = "\n".join(
                f"{'User' if m['role'] == 'user' else 'FBOT'}: {m['content']}"
                for m in history[-MAX_HISTORY:]
            )
            context = f"Previous conversation:\n{context}\n\n"

        # Compose message for RAG chain: preserve original casing
        user_message = input.message.strip()
        full_query = f"{context}User: {user_message}" if context else user_message

        # Get response from RAG chain
        response = qa_chain(full_query)

        # Update history
        history.append({"role": "user",      "content": user_message})
        history.append({"role": "assistant", "content": response})

        # Trim history to avoid unbounded growth
        if len(history) > MAX_HISTORY * 2:
            conversation_store[session_id] = history[-(MAX_HISTORY * 2):]

        return ChatResponse(reply=response, session_id=session_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# ── Clear session endpoint ──────────────────────────────────────────────────
@app.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    conversation_store.pop(session_id, None)
    return {"status": "cleared", "session_id": session_id}
