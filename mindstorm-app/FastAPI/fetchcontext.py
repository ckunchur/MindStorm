import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Retrieve the OpenAI API key from environment variables
pinecone_api_key = os.getenv("PINECONE_API_KEY")
print("Pinecone API Key:", pinecone_api_key)
