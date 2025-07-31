from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # ✅ Now it's safe


llm = ChatGroq(
    api_key=groq_api_key,
    model="llama3-8b-8192"  # Or "llama3-70b-8192" if you want the bigger one
)

prompt = ChatPromptTemplate.from_template("You are a helpful assistant. Answer the question:\n{question}")

chain = prompt | llm

while True:
    question = input("You: ")
    if question.lower() in ["exit", "quit"]:
        break
    try:
        response = chain.invoke({"question": question})
        print("Bot:", response.content)
    except Exception as e:
        print("❌ Error:", e)
