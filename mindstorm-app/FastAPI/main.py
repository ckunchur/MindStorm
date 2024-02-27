from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fetchcontext import generate_advice, UserInput
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

# Use the generate_advice function to process the user input and fetch related context
@app.post("/fetch_context/")
async def fetch_context(user_input: UserInput):
    input_text = user_input.input_text
    print("Fetching context for:", input_text)
    try:
        advice = generate_advice(input_text)
        print("Generated Advice:", advice)
        return {"advice": advice}
    except Exception as e:
        print("Error during context fetching:", str(e))
        raise HTTPException(status_code=500, detail=str(e))