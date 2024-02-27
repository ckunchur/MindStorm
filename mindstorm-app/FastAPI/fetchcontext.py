# fetchcontext.py
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec, PodSpec
from pydantic import BaseModel

# Load environment variables from .env
load_dotenv()

# INITIALIZE PINECONE
pinecone_api_key = os.getenv("PINECONE_API_KEY")
# Determine whether to use serverless
use_serverless = True  # Set this to True or False based on your configuration
if use_serverless:
    cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
    region = os.environ.get('PINECONE_REGION') or 'us-west-2'
    spec = ServerlessSpec(cloud=cloud, region=region)
else:
    environment = os.environ.get('PINECONE_ENVIRONMENT')
    spec = PodSpec(environment=environment)
pc = Pinecone(api_key=pinecone_api_key, spec=spec)
# Define the index name
index_name = 'user-profiles'
# Check if index already exists
if index_name not in pc.list_indexes().names():
    # If index does not exist, create it
    pc.create_index(
        name=index_name,
        dimension=1536,  # dimensionality of text-embedding-ada-002
        metric='cosine',
        spec=spec
    )
# Connect to the index
index = pc.Index(index_name)








# Define Pydantic model for user input here if needed
class UserInput(BaseModel):
    input_text: str

# Simplified function to just print "Hello"
def fetch_related_context(user_input: UserInput):
    print("Hello")
    return {"message": "Hello"}