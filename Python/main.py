from typing import Union

from fastapi import FastAPI

from watsonx import get_response
from watsonx_init import watsonx_initialize

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    watsonx_initialize()

@app.get("/")
def read_root():
    return {"response": get_response()}