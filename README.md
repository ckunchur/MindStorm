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
- run `npm install` 
- run `npx expo start`

## Notes:
- Login is currently not working. Will be resolved ASAP!
- We are currently not working on VoiceAssistant code (will not look updated from sprint 2)
  
## Sprint 3
Sonya: I focused on designing and implementing the RAG logic for the app. I integrated Pinecone, utilizing its vector search to dynamically fetch contextually relevant conversation entries. Incorporated OpenAI's APIs, specifically leveraging the 'text-embedding-ada-002' model for generating text embeddings, and crafted a system prompt after custom GPT testing that incorporates the retrieved entries that produces empathetic responses, similar to talking with a close friend. Designed the upsert logic to prioritize journal entry data in a way that makes sense, ensuring efficient retrieval of past experiences and emotional states through labeled metadata for more nuanced conversation context. Also constructed a feedback loop that updates user profiles with new insights from each conversation, leveraging past entry data from Pinecone and also user profile preference/insight data from Firebase.

Caitlin: I redesigned our screens (ignoring chat for now) to be more in line with our MindStorm product vision (aiming for a more comforting theme with weather elements intentionally incorporated throughout app features). I coded up all of the new screens (LandingScreen, LoginScreen, ChooseGoals, PersonalInfoScreen, CreateAccount, JournalScreen, and JournalSummary) for onboarding and implemented user login/register with Firebase and saving of user personal info in Firebase. I wrote prompts and corresponding API calling functions for classifying top 3 moods and top 3 topics in the entry and recommending which chatbot (Lyra for anxiety/stress or Nimbus for productivity) is better suited for the user based on their entry. I also started working on a "Moodometer" pie chart (maps overall mood of journal entry to weather condition) which will be one of our unique mood tracking visualizations. 

Janet: I took the code that Sonya wrote for the voice chatbot https://github.com/ckunchur/MindStorm-web and cleaned up parts of it / did some front-end for this chat screen in the new React App that Caitlin set-up. I investigated chatbot history - distinguished that there are two parts to it, the in-convo history and the past entries database. I began demos on streamlit using RAG with langchain on a generated txt file of past entries, and could successfully query this larger context. I reached out to the Mental Health Tech Hub and Stanford Brainstorm but got ghosted. I made a custom therapy iphone background generator using DALL-E, which enhances user prompts for meditative scenes https://chat.openai.com/g/g-dCisq5Z6U-soothing-scene-creator-iphone-aspect-ratio which may not be included if it doesn't fit with the designs

## Sprint 4
Sonya: I plan on helping out on the data insights flow (extracting from conversation data and generating visualizations). I'll also work on prompting and designing/setting up the backend for the productivity bot and testing the user flow from there. I will also help clean up/test anything that is needed for final demo. 

Caitlin: I will finish transferring our latest designs to the chat and data insights pages + finish up the data insights page aggregating analysis across all entries in a user's history. I also plan to help rework our RAG choices (e.g. helping make choices like embed each message that is sent vs embedding summary of conversation, how do we weight certain messages more, etc), help with Firebase storage of conversation histories, and help out with integrating Firebase stored user profile data (collected during onboarding) into our RAG-based user profile to finetune our bots' responses. I will help customize the prompting of our 2 bots, exploring unique formats of conversation for boosting engagement (previously considered chat based games to talk through emotions). Time permitting, I will also look into letting users create their own custom therapy bot. Will generally help clean up code structure and make sure backend logic is solid.

Janet: 
