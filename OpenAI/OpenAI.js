import axios from 'axios';
import { top_moods_topics_prompt, mood_weather_classification_prompt, chatbot_recommendation_prompt, lyra_prompt, nimbus_prompt } from './prompts';
import { ExtractUserProfileFromFirebase } from '../firebase/functions';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  }
});


const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now

export const apiCall = async (prompt, messages) => {
    return chatgptApiCall(prompt, messages);
}
// Global variable to remember if the system prompt has already been added
let systemPromptAdded = false;

const chatgptApiCall = async (prompt, messages) => {
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
        console.log("User prompt added");
    }

    try {
        const res = await client.post(chatgptUrl, body);

        let answer = res.data.choices[0].message.content.trim();
        // Append only the new assistant response to the existing messages
        const updatedMessages = [...messages, { role: 'user', content: prompt }, { role: 'assistant', content: answer }];
        console.log(updatedMessages);
        return { success: true, data: updatedMessages };
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