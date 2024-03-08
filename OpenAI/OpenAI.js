import axios from 'axios';
import { top_moods_topics_prompt, mood_weather_classification_prompt, chatbot_recommendation_prompt, lyra_prompt, weeklong_mood_classification_prompt, weeklong_topic_classification_prompt, weeklong_summary_prompt} from './prompts';
import { ExtractUserProfileFromFirebase } from '../firebase/functions';
import { generateResponse } from '../Pinecone/pinecone-requests';

// import { ExtractUserProfileFromFirebase } from './firebase'; // Import the ExtractUserProfileFromFirebase function
// import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env'

const EXPO_PUBLIC_OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY
console.log(EXPO_PUBLIC_OPENAI_API_KEY);

const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      "Authorization": `Bearer ${EXPO_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (prompt, messages) => {
    return chatgptApiCall(prompt, messages);
}

export const apiRAGCall = async (instruction_prompt, user_prompt, messages) => {
    return chatgptApiRAGCall(instruction_prompt, user_prompt, messages);
}

// messages includes previous messages (not current user prompt)
const chatgptApiCall = async (prompt, messages) => {
    const userProfile = await ExtractUserProfileFromFirebase(testUser); // Ensure this function returns a string

    // Define the initial system prompt message only once
    if (!systemPromptAdded) {
        console.log("Adding systemPrompt");
        const systemPrompt = {
            role: 'system',
            content: `Instructions: ${lyra_prompt}. Context about user: ${userProfile}`
        };

        // Add the system prompt to the start of the messages
        messages.unshift(systemPrompt);
        systemPromptAdded = true; // Set the flag so it's not added again
    }

    // Initialize the body with the model and existing messages
    const body = {
        model: "gpt-3.5-turbo",
        messages: [...messages]
    };

    // If there's a user prompt, add it to the message list
    if (prompt) {
        body.messages.push({
            role: 'user',
            content: prompt
        });
    }
    
    try {
        const res = await client.post(chatgptUrl, body);
        let answer = res.data.choices[0].message.content.trim();
        // return user prompt and system response
        const newMessages = [{ role: 'user', content: prompt }, { role: 'system', content: answer }];
        
        console.log(newMessages);
        return { success: true, data: newMessages };

    } catch (err) {
        console.log('error: ', err);
        return { success: false, msg: err.message };
    }
}

// generate ChatGPT response using RAG
export const chatgptApiRAGCall = async (instruction_prompt, user_prompt, messages) => {
    console.log("In rag api call");

    const body = {
        model: "gpt-3.5-turbo",
        messages: [...messages]
    };
   // console.log('body messages', body.messages);
    // If there's a user prompt, add it to the message list
    if (user_prompt) { // Fix the variable name from 'prompt' to 'user_prompt'
        body.messages.push({
            role: 'user',
            content: user_prompt // Fix the variable name from 'prompt' to 'user_prompt'
        });
        console.log("User prompt added");
    }

    try {
        const answer = await generateResponse(instruction_prompt, user_prompt, messages)
        // Append only the new assistant response to the existing messages
        console.log(answer);
        const newMessages = [{ role: 'user', content: user_prompt }, { role: 'system', content: answer }];
        return { success: true, data:newMessages };
    } catch (err) {
        console.log('error: ', err);
        return { success: false, msg: err.message };
    }
}



export const topMoodsAndTopicsWithChatGPT= async (text) => {
    let prompt = top_moods_topics_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });

        let answerString = res.data.choices[0].message.content.trim();
        const topMoodsAndTopics = JSON.parse(answerString);
        return Promise.resolve({success: true, data: topMoodsAndTopics});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}


export const moodWeatherClassificationWithChatGPT= async (text) => {
    let prompt = mood_weather_classification_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });

        let answerString = res.data.choices[0].message.content.trim();
        return Promise.resolve({success: true, data:  answerString});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}


export const recommendTherapyChatbotWithChatGPT= async (text) => {
    let prompt = chatbot_recommendation_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });

        let answerString = res.data.choices[0].message.content.trim();
        return Promise.resolve({success: true, data: answerString});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

//weeklong summary prompts
export const weeklongSummaryWithChatGPT= async (text) => {
    let prompt = weeklong_summary_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });
        let answerString = res.data.choices[0].message.content.trim();
        return Promise.resolve({success: true, data:  answerString});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}
export const weeklongTopicClassificationWithChatGPT= async (text) => {
    let prompt = weeklong_topic_classification_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });
        let answerString = res.data.choices[0].message.content.trim();
        return Promise.resolve({success: true, data:  answerString});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

export const weeklongMoodClassificationWithChatGPT= async (text) => {
    let prompt = weeklong_mood_classification_prompt;
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ] 
        });
        let answerString = res.data.choices[0].message.content.trim();
        return Promise.resolve({success: true, data:  answerString});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
    }
}