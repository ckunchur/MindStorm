# MindStorm-mobile
MindStorm is an app designed to "help you find the calm in your storm" with the goal of empowering users to navigate their mental challenges. Currently, we are focused on helping users with stress/anxiety and productivity, offering 2 chatbots ("Lyra" and "Nimbus") for immediate guidance. MindStorm also has space for free journaling for quick mental insights. Data analysis is performed across chat history and journal entries, allowing users to track their mood and writing content over time. 

See old web app repo [here](https://github.com/ckunchur/MindStorm-web).

## How to run app locally
MindStorm currently uses ReactNative, Firebase, and OpenAI's GPT 3.5 model. 
- `cd mindstorm-app`
- create `.env` file with `EXPO_PUBLIC_OPENAI_API_KEY` and paste your OpenAI key. 
- run `npx expo start`
## Sprint 2


Sonya: I primarily worked on the front-end and back-end (not including server/data storage) voice assistant functionality within the mobile app (all commits in old repo, just pushed final voice assistant from old repo). Experimented with Flutter. Worked on prompting with OpenAI and creating a custom GPT that can analyze journal entries/stressful thoughts and make actionable checklists. Validated custom GPT ability to adapt to user preferences when giving advice and suggestions for coping mechanisms. Also got user validation from TikTok.

Caitlin: I set up our new mobile app; redesigned (Figma)and coded (React Native/Expo) almost all of the screens (landing, journaling/analysis, choose/customize bot, data insights). I also reconfigured Firebase + worked on backend functions for our mobile app to store chat history, free journal entry history, and user bot customization settings.

## Sprint 3
Sonya: I plan on helping out with the front-end, the GPT prompting, as well as data storage. My focus will be on trying to make the GPT produce the intended output and implementing trigger safeguards for sensitive information such as trauma. I will work on creating different custom GPTs for the respective "buddies" in the app for each need.

Caitlin: I plan to continue working on frontend/backend, will help tailor our existing bot buddies and configure a DIY bot for users to define their own speciifc needs. I also plan to help with RAG integration for analysis based on both journal entries and chat history. I will help with integrating/improving our previously created API calls for content and emotional analysis into the app. 
