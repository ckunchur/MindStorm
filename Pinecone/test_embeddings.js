const OpenAI = require("openai");
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config();

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY
});

// Function to get embeddings for a given text
async function getEmbeddings(text, model = "text-embedding-3-small") {
  try {
    // Replace newline characters with spaces
    text = text.replace(/\n/g, " ");
    
    const response = await openai.embeddings.create({
      model: model,
      input: [text],
      encoding_format: "float",
    });

    // Extract the embedding from the response
    console.log(response.data[0].embedding);
    return response;
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    throw error; // or handle error as needed
  }
}

// Example text to embed
const exampleText = "Your text string goes here";

// Call getEmbeddings function with example text
getEmbeddings(exampleText)
  .then(embedding => {
    console.log('Embedding:', embedding);

  })
  .catch(error => {
    console.error('Error:', error);
  });
