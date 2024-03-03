import axios from 'axios';
import { top_moods_topics_prompt, mood_weather_classification_prompt, chatbot_recommendation_prompt } from './prompts';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  }
});


const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

export const apiCall = async (prompt, messages) => {
    return chatgptApiCall(prompt, messages);
}

const chatgptApiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages: [{
                role: 'user',
                content: prompt
            }, ...messages] // Assuming 'messages' includes previous chat history if needed
        });

        let answer = res.data.choices[0].message.content.trim();
        // Assuming you want to append the new response to the existing messages
        const updatedMessages = [...messages, {role: 'assistant', content: answer}];
        return Promise.resolve({success: true, data: updatedMessages});
    } catch (err) {
        console.log('error: ', err);
        return Promise.resolve({success: false, msg: err.message});
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