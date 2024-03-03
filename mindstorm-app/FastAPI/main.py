from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fetchcontext import generate_advice  # Assuming this imports correctly
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = FastAPI()

# Initialize Firebase Admin
cred = credentials.Certificate("path/to/your/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

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
    session_id: str  # Added session_id to track user sessions
    input_text: str

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/user_input/")
async def handle_user_input(user_input: UserInput):
    input_text = user_input.input_text
    session_id = user_input.session_id  # Retrieve session_id from user input
    print("User Input:", input_text)
    # Here, you could add logic to append user input to Firestore
    return {"message": "User input received"}

# Function to append conversation to Firestore
def append_to_session_history(session_id, user_message, system_response=None):
    session_ref = db.collection('sessions').document(session_id)
    messages_ref = session_ref.collection('messages')
    # Add user message
    messages_ref.add({
        'sender': 'user',
        'message': user_message,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
    if system_response:
        # Optionally, add system response
        messages_ref.add({
            'sender': 'system',
            'message': system_response,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

# Function to get session history from Firestore
async def get_session_history(session_id):
    session_ref = db.collection('sessions').document(session_id)
    messages_ref = session_ref.collection('messages').order_by('timestamp')
    docs = messages_ref.stream()
    history = "\n---\n".join([f"{doc.to_dict()['sender'].title()}: {doc.to_dict()['message']}" for doc in docs])
    return history

# Use the generate_advice function to process the user input and fetch related context
@app.post("/fetch_context/")
async def fetch_context(user_input: UserInput):
    input_text = user_input.input_text
    session_id = user_input.session_id
    print("Fetching context for:", input_text)
    try:
        session_history = await get_session_history(session_id)
        advice = generate_advice(session_history + "\nUser: " + input_text)
        append_to_session_history(session_id, input_text, advice)
        print("Generated Advice:", advice)
        return {"advice": advice}
    except Exception as e:
        print("Error during context fetching:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
