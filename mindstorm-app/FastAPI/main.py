from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fetchcontext import fetch_related_context, UserInput

app = FastAPI()

# Set up CORS middleware options
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define Pydantic model for user input
class UserInput(BaseModel):
    input_text: str

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/user_input/")
async def handle_user_input(user_input: UserInput):
    input_text = user_input.input_text
    print("User Input:", input_text)
    return {"message": "User input received"}

# from user input, fetch related context from pinecone
@app.post("/fetch_context/")
async def fetch_context(user_input: UserInput):
    return fetch_related_context(user_input)