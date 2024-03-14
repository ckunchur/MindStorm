// import { readChatHistoryFromFirebase, ExtractEntriesFromFirebase } from "../firebase/functions";
const { readChatHistoryFromFirebase, ExtractEntriesFromFirebase } = require("../firebase/functions");

import { Pinecone } from '@pinecone-database/pinecone';
import { testUser } from "../firebase/functions";
import axios from 'axios';

export const pineconeApiKey = process.env.EXPO_PUBLIC_PINECONE_API_KEY;
export const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;



const openaiClient = axios.create({
baseURL: 'https://api.openai.com/v1',
headers: {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json'
}
});

// Pinecone configuration and initialization
const pc = new Pinecone({
  apiKey: pineconeApiKey,
});


const chat_history_index = pc.index('chat-history-index');
const entry_history_index = pc.index('entry-history-index');



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



const upsertSession = async (session_id, text) => {
  try {
    const vector = await getEmbeddings(text); // Get the embedding vector for the text
    // Upsert the vector into the Pinecone index with the associated user ID
    await index.upsert([{ id: session_id, values: vector }]);
    console.log(`Upsert successful for session ID: ${user_id}`);
  } catch (error) {
    console.error('Error upserting user profile:', error);
  }
};


// assumes format of each entry is {id: string, text: string }
export async function upsertEntries(entries) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].text;
    const vectorValues = await getEmbeddings(entry.text); // This should return a vector
    const record = {
      "id": `${entry.id}`,
      "values": vectorValues,
      "metadata": {"description": entry.text }
    };
    await entry_history_index.upsert([record]);
  }
}

function formatContext(topMatches) {
  const contexts = topMatches.matches.map(match => match.metadata.description || 'No description available');
  return contexts.join('\n---\n');
}

async function generateResponse(system_prompt, messages, query) {
  const sessionHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const combinedText = `${sessionHistory}\n${query}`;
  const combinedVector = await getEmbeddings(combinedText);

  try {
      const topMatches = await chat_history.query({ topK: 3, vector: combinedVector, includeMetadata: true });
      const context = formatContext(topMatches);
      const fullPrompt = `System Prompt: ${system_prompt} \nSession History: ${sessionHistory} \nRAG Context: ${context} \nUser Prompt: ${query}`;

      // Instead of creating a new message, you're using the prompt directly
      const response = await openai.chat.completions.create({
          prompt: fullPrompt,
          model: "gpt-3.5-turbo",
      });

      return response.choices[0].message.content.trim();

  } catch (error) {
      console.error("Error in generating advice:", error);
      throw error;
  }
}

// node testing attempt
// async function runUpsertTest() {
//   try {
//       // Extract entries from Firebase
//       const entries = await ExtractEntriesFromFirebase(testUser);
//       console.log("Extracted entries:", entries);

//       // Upsert entries into Pinecone
//       await upsertEntries(chat_history_index, entries);
//       console.log("Entries upserted into Pinecone index.");

//   } catch (error) {
//       console.error('Error during test:', error);
//   }
// }

// runUpsertTest();
