from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from watsonx import get_chat_response, get_summarization_response
from watsonx_init import watsonx_initialize

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["https://zdravdim.github.io/IBM-Hackathon-2024"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    watsonx_initialize()

class ChatMessage(BaseModel):
    requestMessage: str

@app.post("/chat")
def read_root(chatMessage: ChatMessage):
    return { "responseMessage": get_chat_response(chatMessage) }

@app.post("/summarization")
async def read_root(summarizationMessage: str = Form(...), document: UploadFile = File(...)):
    return { "responseMessage": await get_summarization_response(summarizationMessage, document) }