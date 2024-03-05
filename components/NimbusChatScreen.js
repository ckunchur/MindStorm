import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiCall } from '../OpenAI/OpenAI';
import axios from 'axios';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { writeChatHistoryToFirebase, ExtractUserProfileFromFirebase} from '../firebase/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { v1 as uuidv1, v3 as uuidv3, v5 as uuidv5, NIL as NIL_UUID } from 'uuid';
// Seemed like I needed this for Expo GO, but using ios simulator on laptop instead now
// const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
import { nimbus_greeting, nimbus_prompt } from '../OpenAI/prompts';
const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now

const generateRandomSessionID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


export default function NimbusChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  const route = useRoute();
  const { entryText } = route.params;
  console.log("entryText on Nimbus scrreen", entryText);
  const userProfile = ExtractUserProfileFromFirebase(testUser); 
  const instructionPrompt = { role: 'system', content: `Context about user: ${userProfile}. System instructions: ${nimbus_prompt}`};
  const greetingPrompt = { role: 'system', content: `${nimbus_greeting}`};

  let startingPrompt = [instructionPrompt, greetingPrompt];
  const [chatHistory, setChatHistory] = useState([]);

  // Initialize chatHistory as an empty array 
  useEffect(() => {
    const initializeChatHistory = async () => {
      const userProfile = await ExtractUserProfileFromFirebase(testUser);
      const instructionPrompt = {
        role: 'system',
        content: `Context about user: ${userProfile}. System instructions: ${nimbus_prompt}`,
      };
      if (entryText) {
        setUserInput(entryText);
        setChatHistory([instructionPrompt]); 
      }
      else {
        setChatHistory(startingPrompt);
      }
    };
    initializeChatHistory();
  }, []); 
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

  const handleBackPress = () => {
    setSessionID(""); // Reset session ID
    setChatHistory([instructionPrompt, greetingPrompt]); // Optionally clear chat history if starting fresh next time
    navigation.goBack();
  };

  console.log("lyrachathistory", chatHistory);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/chat-nimbus-background.png')} style={styles.bgImage}>

      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
            </TouchableOpacity>

        <ScrollView style={styles.chatContainer}>
          { chatHistory.length < 2 ? null :
          chatHistory.slice(1).map((msg, index) => (
            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={{ color: msg.role === 'user' ? '#ffffff' : '#000000' }}>{msg.content}</Text>
            </View>
          ))
          }
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