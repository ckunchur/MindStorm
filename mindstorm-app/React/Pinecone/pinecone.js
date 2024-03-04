import { readChatHistoryFromFirebase, ExtractEntriesFromFirebase } from "../firebase/functions";
import { Pinecone } from '@pinecone-database/pinecone';


const pineconeApiKey = process.env.PINECONE_API_KEY;
const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now


// Pinecone configuration and initialization
const pc = new Pinecone({
    apiKey: pineconeApiKey,
  });

const openaiClient = axios.create({
baseURL: 'https://api.openai.com/v1',
headers: {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json'
}
});

const model = "text-embedding-ada-002";
async function getEmbeddings(text) {
    try {
      const response = await openaiClient.post('/embeddings', {
        model: model,
        input: text
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching embeddings:', error);
      throw error; // or handle error as needed
    }
  }

await pc.createIndex({
name: 'chat-history-index',
dimension: 1536,  // dimensionality of text-embedding-ada-002
metric: 'cosine',
spec: {
    serverless: {
    cloud: 'aws',
    region: 'us-west-2',
    },
},
});

await pc.createIndex({
name: 'journal-entry-index',
dimension: 1536,
metric: 'cosine',
spec: {
    serverless: {
    cloud: 'aws',
    region: 'us-west-2',
    },
},
});

function embed_entries() {

}

function embed_chat_sessions() {
    
}

export async function fetchContext(userInput, sessionMessages) {
    console.log("Fetching context for:", userInput);
    try {
        const advice = generateAdvice(sessionMessages + "\nUser: " + userInput);
        console.log("Generated Advice:", advice);
        return { advice: advice };
    } catch (e) {
        console.log("Error during context fetching:", e);
    }
}
