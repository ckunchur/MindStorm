import { readChatHistoryFromFirebase, ExtractEntriesFromFirebase } from "../firebase/functions";
import { Pinecone } from '@pinecone-database/pinecone';

import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai';
import { readChatHistoryFromFirebase } from '../firebase/functions.js';
import { useState, useEffect } from 'react';

//const pineconeApiKey = process.env.EXPO_PUBLIC_PINECONE_API_KEY;
//const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const pineconeApiKey = 'f4dfdc42-9c5a-4ee4-8d61-fed389fdd47a';
const openaiApiKey = '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';
const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now
//const axios = require('axios');
const SYSTEM_PROMPT = `Ella is designed to offer highly personalized support by remembering users' preferences and responses to suggested stress reduction techniques over time. When users set specific goals for stress management, Ella takes note of what strategies work and what doesn't, tailoring future suggestions based on these preferences. This approach ensures each conversation is personalized, making suggestions more relevant and effective. Make the tone conversational, like an empathetic and gentle best-friend that relates to you. For instance, if a user mentions that journaling was not helpful but enjoyed morning walks, Ella will adapt by suggesting activities aligned with what has been effective. A suggestion for a quick stress-relieving activity might be, "Since journaling didn't work out for you last week, let's try something different! You seemed to like the walk in the morning, so let's try moving your body. How about a quick HIIT session? I can design a routine for you, all you need is a timer." This personalized feedback loop enriches the conversation, making each interaction feel more personal and supportive, enhancing the user's journey towards better managing their stress and anxiety.`;



async function initialize() {
  const SESSION_HISTORY = await readChatHistoryFromFirebase(userId, session_id);
  
  // Other initialization logic here
}




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

// Call createIndexIfNotExists function for each index
(async () => {
  await createIndex('chat-history-index');
})();

const chat_history = pc.index("chat-history-index");



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


const sampleEntries = [
  "I absolutely love outdoor activities, especially hiking and biking in the mountains. It's the best way for me to clear my mind and relieve stress.",
  // Add other sample entries...
];

async function upsertSampleEntries(index) {
  for (let i = 0; i < sampleEntries.length; i++) {
    const entry = sampleEntries[i];
    const vectorValues = await getEmbeddings(entry); // This should return a vector
    const record = {
      "id": `session_${i}`,
      "values": vectorValues,
      "metadata": {"description": entry }
    };
    await index.upsert([record]);
  }
}

function formatContext(topMatches) {
  const contexts = topMatches.matches.map(match => match.metadata.description || 'No description available');
  return contexts.join('\n---\n');

  
}

async function generateResponse(sessionHistory, query) {
  const combinedText = `${sessionHistory}\n${query}`;
  const combinedVector = await getEmbeddings(combinedText);

  try {
      const topMatches = await chat_history.query({ topK: 3, vector: combinedVector, includeMetadata: true });
      const context = formatContext(topMatches);
      const prompt = `System: ${SYSTEM_PROMPT} \nSession History: ${sessionHistory} \nRAG Context: ${context} \nUser: ${query} \nElla: `;

      const response = await openai.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: "gpt-3.5-turbo",
      });

      return response.choices[0].message.content;

  } catch (error) {
      console.error("Error in generating advice:", error);
      throw error;
  }
}

//Test
// (async () => {
//   console.log("Testing Pinecone Connection...");
//   await createIndex('chat-history-index');

//   console.log("Testing Embedding Functionality...");
//   const testEmbedding = await getEmbeddings("This is a test string to generate embeddings.");
//   console.log("Embedding Result:", testEmbedding);

//   console.log("Upserting Sample Entries...");
//   await upsertSampleEntries(chat_history);

//   const userQuery = "I still feel so overwhelmed."

//   console.log("Generating Response...");
//   const advice = await generateResponse(SESSION_HISTORY, userQuery, chat_history);
//   console.log("Generated Advice:", advice);
// })();

export const chatHistoryIndex = chat_history;
