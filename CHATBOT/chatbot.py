import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

load_dotenv()

model_id = "mistralai/Mistral-7B-Instruct-v0.1"
token = os.getenv("HUGGINGFACE_TOKEN")

tokenizer = AutoTokenizer.from_pretrained(model_id, token=token)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", token=token)

chat = pipeline("text-generation", model=model, tokenizer=tokenizer)

response = chat("What is FinSight?", return_full_text=False)
print(response[0]["generated_text"])
