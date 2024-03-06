import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiCall } from '../OpenAI/OpenAI';
import axios from 'axios';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ChatScreen.js

import { generateResponse, chatHistoryIndex } from '../Pinecone/pinecone';
import { writeChatHistoryToFirebase, readChatHistory, ExtractUserProfileFromFirebase} from '../firebase/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { v1 as uuidv1, v3 as uuidv3, v5 as uuidv5, NIL as NIL_UUID } from 'uuid';
// Seemed like I needed this for Expo GO, but using ios simulator on laptop instead now
// const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now

const generateRandomSessionID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


export default function ChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  
  // Initialize chatHistory as an empty array 
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionID, setSessionID] = useState("");


  // THIS CODE IS THE IN CONVO CHAT HISTORY, see apiCall in OpenAI.js
  const handleSend = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages
    // Temporary array to hold the new message and response for appending
  

    let newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    const response = await apiCall(userInput, newChatHistory);
    if (response.success && response.data.length > 0) {
   
      // Append AI's response to the newChatHistory
      const aiResponse = response.data[response.data.length - 1]; // Assuming the last response is from AI
      newChatHistory.push(aiResponse);
      console.log(newChatHistory);
      setChatHistory(newChatHistory);
      if (sessionID === "" ) {
        const newSessionID = generateRandomSessionID(); // Implement this function to generate a unique ID
        console.log("sessionid", newSessionID);
        setSessionID(newSessionID);
      }
      await writeChatHistoryToFirebase(testUser, sessionID, newChatHistory);
      setUserInput(''); // Clear input after sending
      console.log('chatHistory', chatHistory)
    } else {
      console.error(response.msg);
    }
  };

  const userQuery = "hello";
  const user_sessionID = "iheWY2KtHUqgRT1b0wR1";

  const handleGenerateAdvice = async () => {
    try {
      const sessionHistory = await readChatHistory(testUser, sessionID);
      const advice = await generateResponse(sessionHistory, userQuery, chatHistoryIndex);
      console.log("Generated Advice:", advice);
    } catch (error) {
      console.error("Error generating advice:", error);
    }
  };

  const handleBackPress = () => {

    setSessionID(""); // Reset session ID

    const text = readChatHistory(testUser, user_sessionID);
    handleGenerateAdvice();
    setChatHistory([]); // Optionally clear chat history if starting fresh next time
    navigation.goBack();
  };

  // THIS CODE JUST CONNECTS TO FASTAPI FETCH CONTEXT, BUT DOESNT PRINT IT
  // const handleSend = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8000/fetch_context/", { input_text: userInput });
  //     console.log(response.data);
  //     Alert.alert('Success', 'User input sent successfully');
  //   } catch (error) {
  //     console.error('There was an error with the API call', error);
  //     Alert.alert('Error', 'Failed to send user input');
  //   }
  // };

  // const handleSend = async () => {
  //   if (!userInput.trim()) {
  //     // Prevent sending empty messages
  //     Alert.alert('Empty Input', 'Please type something to get advice.');
  //     return;
  //   }
  
  //   try {
  //     // Send user input to the FastAPI backend
  //     const response = await axios.post("http://localhost:8000/fetch_context/", { input_text: userInput });
  
  //     if (response.data && response.data.advice) {
  //       // Print the advice received from the backend
  //       console.log("Advice:", response.data.advice);
  //       // Assuming you want to add both the user's question and the AI's advice to the chat history
  //       let newChatHistory = [...chatHistory, { role: 'user', content: userInput }, { role: 'ai', content: response.data.advice }];
  //       // Update the state to include the new messages
  //       setChatHistory(newChatHistory);
  //       // Clear input after sending
  //       setUserInput('');
  //     } else {
  //       console.error('No advice received');
  //       Alert.alert('Error', 'No advice received from the server');
  //     }
  //   } catch (error) {
  //     console.error('There was an error with the API call', error);
  //     Alert.alert('Error', `Failed to get advice: ${error.message}`);
  //   }
  // };
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/onboarding-background.png')} style={styles.bgImage}>

      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
            </TouchableOpacity>

        <ScrollView style={styles.chatContainer}>
          {chatHistory.slice(1).map((msg, index) => (
            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={{ color: msg.role === 'user' ? '#ffffff' : '#000000' }}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setUserInput}
            value={userInput}
            placeholder="Type your message..."
          />
          
          <TouchableOpacity onPress={handleSend}>
                <Ionicons name="send-outline" color="white" size={36} />
            </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  // Existing styles remain unchanged
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    width: windowWidth,
    height: windowHeight,
    padding: 20,
  },  
  backButton: {
    position: 'absolute',
    top: 80, // Adjusted to be below status bar
    left: 20,
    zIndex: 10, // Ensure the back button is above the chat bubbles
},
  testButton: {
    // Style for the Test Hello World Button
    backgroundColor: '#4CAF50', // Green background
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 140, // Add some margin at the top
    alignSelf: 'center', // Center button
  },
  testButtonText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,

  },
  input: {
    flex: 1, 
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 24,
    paddingHorizontal: 10,
    backgroundColor: "#FFF", // Set input background to white
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 40
  },
  sendButtonText: {
    color: '#ffffff',
  },
  chatContainer: {
    flex: 1,
    marginTop: 100,
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },
});