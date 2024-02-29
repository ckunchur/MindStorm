# MindStorm-mobile
MindStorm is an app designed to "help you find the calm in your storm" with the goal of empowering users to navigate their mental challenges. Currently, we are focused on helping users with stress/anxiety and productivity, offering 2 chatbots ("Lyra" and "Nimbus") for immediate guidance. MindStorm also has space for free journaling for quick mental insights. Data analysis is performed across chat history and journal entries, allowing users to track their mood and writing content over time. 

See old web app repo [here](https://github.com/ckunchur/MindStorm-web).

## How to run FastAPI backend
- `cd mindstorm-app/FastAPI` 
- Make a .env file with API keys
- Set up a virtual environment
- `pip install -r requirements.txt`
- run `uvicorn main:app --host 0.0.0.0 --reload`

In a separate terminal
## How to run React Native front-end
- `cd mindstorm-app/React` 
- run `npx expo start`
## Sprint 3


Sonya: I focused on designing and implementing the RAG logic for the app. I integrated Pinecone, utilizing its vector search to dynamically fetch contextually relevant conversation entries. Incorporated OpenAI's APIs, specifically leveraging the 'text-embedding-ada-002' model for generating text embeddings, and crafted a system prompt after custom GPT testing that incorporates the retrieved entries that produces empathetic responses, similar to talking with a close friend. Designed the upsert logic to prioritize journal entries, ensuring efficient retrieval of past experiences and emotional states through labeled metadata for more nuanced conversation context. Also constructed a feedback loop that updates user profiles with new insights from each conversation, leveraging past entry data from Pinecone and also user profile preference/insight data from Firebase.

Caitlin: I set up our new mobile app; redesigned (Figma)and coded (React Native/Expo) almost all of the screens (landing, journaling/analysis, choose/customize bot, data insights). I also reconfigured Firebase + worked on backend functions for our mobile app to store chat history, free journal entry history, and user bot customization settings.

Janet: I took the code that Sonya wrote for the voice chatbot https://github.com/ckunchur/MindStorm-web and cleaned up parts of it / did some front-end for this chat screen in the new React App that Caitlin set-up. I investigated chatbot history - distinguished that there are two parts to it, the in-convo history and the past entries database. I began demos on streamlit using RAG with langchain on a generated txt file of past entries, and could successfully query this larger context. I reached out to the Mental Health Tech Hub and Stanford Brainstorm but got ghosted. I made a custom therapy iphone background generator using DALL-E, which enhances user prompts for meditative scenes https://chat.openai.com/g/g-dCisq5Z6U-soothing-scene-creator-iphone-aspect-ratio which may not be included if it doesn't fit with the designs

## Sprint 4
Sonya: I plan on helping out with the front-end, the GPT prompting, as well as data storage. My focus will be on trying to make the GPT produce the intended output and implementing trigger safeguards for sensitive information such as trauma. I will work on creating different custom GPTs for the respective "buddies" in the app for each need.

Caitlin: I plan to continue working on frontend/backend, will help tailor our existing bot buddies and configure a DIY bot for users to define their own speciifc needs. I also plan to help with RAG integration for analysis based on both journal entries and chat history. I will help with integrating/improving our previously created API calls for content and emotional analysis into the app. 

Janet: I plan on researching and testing more how to use past context in therapeutic conversations. This could be some slider of how much context you prefer the LLM to bring up or not. I think it's important for the LLM to take into account the time and frequency of past entries to sort what's relevant. I want to look at psychology or therapy resources of how this is brought up. I'm pretty curious about building some 'theory of mind' of a person. Do you actually want the LLM to fill in a holistic overview of the person to allow them to be better understood, and to save this? Would you summarize this context or use the whole database? If you do summarize, what do you prioritize? I am curious about these questions. Also how good will similarity search/ FAISS be for our purposes? This may require further investigation. However, on the practical side, I want to help with any of the front-end and back-end aspects, we probably should do something about the insights page. So I will help with this or the RAG stuff. 
