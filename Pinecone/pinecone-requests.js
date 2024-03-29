import axios from 'axios';
const PINECONE_UPSERT_ENTRIES_ENDPOINT = `https://entry-history-index-75ukjm4.svc.apw5-4e34-81fa.pinecone.io/vectors/upsert`;
const PINECONE_QUERY_ENTRIES_ENDPOINT = `https://entry-history-index-75ukjm4.svc.apw5-4e34-81fa.pinecone.io/query`;
const PINECONE_UPSERT_CHATS_ENDPOINT = `https://chat-history-index-75ukjm4.svc.apw5-4e34-81fa.pinecone.io/vectors/upsert`;
const PINECONE_QUERY_CHATS_ENDPOINT = `https://chat-history-index-75ukjm4.svc.apw5-4e34-81fa.pinecone.io/query`;


import { EXPO_PUBLIC_PINECONE_API_KEY } from '@env'
const PINECONE_API_KEY = EXPO_PUBLIC_PINECONE_API_KEY;
const EXPO_PUBLIC_OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openaiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${EXPO_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }
});
const model = "text-embedding-ada-002";
async function getEmbeddings(text) {
    console.log("text for embedding", text);
    try {
        const response = await openaiClient.post('/embeddings', {
            model: model,
            input: text
        });
        console.log("embedding response received");
        return response.data.data[0].embedding;
        console.log("embedding", response.data.data[0].embedding);
    } catch (error) {
        console.error('Error fetching embeddings, pinecone-requests:', error);
        throw error; // or handle error as needed
    }
}


export async function upsertEntriesToPinecone(entries) {
    const vectorRecords = await Promise.all(entries.map(async entry => {
        const vectorValues = await getEmbeddings(entry.text); // extract just vector values
        return {
            "id": entry.id,
            "values": vectorValues,
            "metadata": { "description": entry.text }
        };
    }));
       try {
        const response = await fetch(PINECONE_UPSERT_ENTRIES_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': PINECONE_API_KEY,
            },
            body: JSON.stringify({
                vectors: vectorRecords
            }),
        });
        if (!response.ok) {
            throw new Error(`Pinecone upsert entries failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error upserting entry vectors into Pinecone:', error);
        throw error;
    }
}





export async function upsertChatSessionsToPinecone(chats) {
    const vectorRecords = await Promise.all(chats.map(async chat => {
        const vectorValues = await getEmbeddings(chat.messages); 
        return {
            "id": chat.id,
            "values": vectorValues,
            "metadata": { "chatSession": chat.messages }
        };
    }));
       try {
        const response = await fetch(PINECONE_UPSERT_CHATS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': PINECONE_API_KEY,
            },
            body: JSON.stringify({
                vectors: vectorRecords
            }),
        });

        if (!response.ok) {
            throw new Error(`Pinecone upsert chats failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error upserting chat vectors into Pinecone:', error);
        throw error;
    }
}

function formatContext(topMatchesResponse) {
    // Extract the matches array from the response data
    const matches = topMatchesResponse.data.matches;
  
    // Map over the matches to extract the description from each match's metadata
    // and handle cases where the description might not be available
    const contexts = matches.map(match => 
      match.metadata && match.metadata.description ? match.metadata.description : 'No description available'
    );
  
    // Join the extracted descriptions into a single string with a separator
    return contexts.join('\n---\n');
}

// currently just searches over journal entries. TO DO: update to search from chats and entries separately?
export async function generateResponse(instruction_prompt, user_prompt, messages) {
    // console.log("in generateResponse");
    // console.log("read instruction prompt", instruction_prompt);
    // console.log("read user prompt", user_prompt);
    // console.log("read messages", messages);

    const sessionHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const combinedText = `${sessionHistory}\n${user_prompt}`;
    const combinedVector = await getEmbeddings(combinedText); 

    try {
      const topMatchesResponse = await axios.post(PINECONE_QUERY_ENTRIES_ENDPOINT, {
        topK: 3,
        vector: combinedVector,
        includeMetadata: true
      },  {
        headers: {
        'Api-Key': PINECONE_API_KEY , // Make sure PINECONE_API_KEY contains your actual API key
        'Content-Type': 'application/json'
      }
    });

    const context = formatContext(topMatchesResponse); 

    // don't know if we need instruction prompt
      const fullPrompt = `Take the following instruction prompt, chat history, and RAG context from user journal entries to best answer the user prompt.\nSystem Prompt: ${instruction_prompt}\nSession History: ${sessionHistory}\nRAG Context: ${context}\nUser Prompt: ${user_prompt}`;
    // const rag_context_prompt = `take original instruction prompt from the beginning of this chat and the following context from relevant chat sessions to provide the best response to the following user prompt. RAG context:  ${context}`
      // Use openaiClient to make the POST request
      const response = await openaiClient.post('/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: fullPrompt
        }]
      });
      const trimmedResponse = response.data.choices[0].message.content.trim();
      return trimmedResponse;

      // option 2: using existing messages but adds an extra message in the chat each time u want to do rag
    //   const updatedMessages = [
    //     ...messages, // Your session history transformed into the appropriate format
    //     { role: "system", content: context }, // RAG Context as a system message
    //     { role: "user", content: query } // The latest user query
    //   ];
    //   const response = await openaiClient.post('/chat/completions', {
    //     model: "gpt-3.5-turbo",
    //     messages: updatedMessages
    //   });
  
      // Assuming the structure of the response aligns with OpenAI's API structure
    } catch (error) {
      console.error("Error in generating response:", error);
      throw error;
    }
  }
  
  // assume form is of {id: id, text: entry text}
  export const upsertSingleEntry = async (entry) => {
    try {
      const pineconeResponse = await upsertEntriesToPinecone([entry]);
      console.log("Entry upserted into Pinecone index:", pineconeResponse);
    } catch (error) {
      console.error('Error during test:', error);
    }
  };

  // assume form is of form {id: id, messages: concatenated messages string}
  export const upsertSingleChat = async (history) => {
    try {
      const pineconeResponse = await upsertChatSessionsToPinecone(history);
      console.log("Chat upserted into Pinecone index:", pineconeResponse);
    } catch (error) {
      console.error('Error during test:', error);
    }
  };