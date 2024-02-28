# fetchcontext.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec, PodSpec
from openai import OpenAI

SYSTEM_PROMPT = """Ella is designed to offer highly personalized support by remembering users' preferences and responses to suggested stress reduction techniques over time. When users set specific goals for stress management, Ella takes note of what strategies work and what doesn't, tailoring future suggestions based on these preferences. This approach ensures each conversation is personalized, making suggestions more relevant and effective. Make the tone conversational, like an empathetic and gentle best-friend that relates to you.

For instance, if a user mentions that journaling was not helpful but enjoyed morning walks, Ella will adapt by suggesting activities aligned with what has been effective. A suggestion for a quick stress-relieving activity might be, \"Since journaling didn't work out for you last week, let's try something different! You seemed to like the walk in the morning, so let's try moving your body. How about a quick HIIT session? I can design a routine for you, all you need is a timer.\" This personalized feedback loop enriches the conversation, making each interaction feel more personal and supportive, enhancing the user's journey towards better managing their stress and anxiety."""

# Load environment variables from .env
load_dotenv()
pinecone_api_key = os.getenv("PINECONE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")
print(pinecone_api_key)

# INITIALIZE PINECONE
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
print(index.describe_index_stats())

# Initialize OpenAI client
client = OpenAI(api_key=openai_api_key)
model = "text-embedding-ada-002"

def upsert_user_profile(user_id, text):
    vector = embed_text(text)
    index.upsert(vectors=[(user_id, vector)])
    
def embed_text(text, model=model):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

def format_context(top_matches):
    """
    Formats the retrieved matches from Pinecone into a coherent context string.

    Parameters:
    - top_matches: The result from a Pinecone query, expected to have 'matches' with 'metadata'.

    Returns:
    A string that concatenates the relevant contexts for use in the LLM prompt.
    """
    contexts = []
    for match in top_matches['matches']:
        # Adjusted to use 'description' key from metadata
        context_text = match['metadata'].get('description', 'No description available')
        contexts.append(context_text)

    formatted_context = "\n---\n".join(contexts)
    return formatted_context

sample_entries = [
    "I absolutely love outdoor activities, especially hiking and biking in the mountains. It's the best way for me to clear my mind and relieve stress.",
    "I have a deep appreciation for classical music and meditation. These practices help me find inner peace and balance, especially after a long day of work.",
    "I strongly dislike crowded places; they make me feel anxious. Instead, I prefer reading at home or gardening, which brings me a lot of joy and tranquility.",
    "Cooking exotic recipes and trying out new cuisines is my passion. It's a creative outlet for me and a great way to de-stress.",
    "I find solace in writing poetry and journaling. It's a profound way for me to process my emotions and articulate my thoughts."
]
# Assuming embed_text returns a list directly usable as "values"
for i, entry in enumerate(sample_entries):
    user_id = f"user_strong_pref_{i}"
    vector_values = embed_text(entry)  # This should directly return a list
    # Now upsert into Pinecone
    index.upsert(vectors=[
        {
            "id": user_id,
            "values": vector_values,
            "metadata": {
                "description": entry
            }
        }
    ])

def generate_advice(query):
    print(f"original query: {query}")
    query_vector = embed_text(query)
    print(f"query vector: {query_vector[:10]}")  # print first 10 elements for brevity
    try:
        top_matches = index.query(vector=[query_vector], top_k=3, include_metadata=true)
    except exception as e:
        print(f"querying error: {e}")
        raise
    print(top_matches)
    context = format_context(top_matches)
    prompt = f"{SYSTEM_PROMPT}\n\nPreviously: {context}\n\nUser: {query}\nElla:"
    response = client.chat.completions.create(
        messages=[
            {"role": "user", "content": prompt},
        ],
        model="gpt-3.5-turbo",
    )
    return response.choices[0].message.content


class UserInput(BaseModel):
    input_text: str
