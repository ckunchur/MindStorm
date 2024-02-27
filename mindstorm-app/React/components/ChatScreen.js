import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiCall } from './OpenAi';
import axios from 'axios';
import { Alert } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// Seemed like I needed this for Expo GO, but using ios simulator on laptop instead now
// const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

export default function ChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');

  // Initialize chatHistory as an empty array 
  const [chatHistory, setChatHistory] = useState([]);
  async function fetchHelloWorld() {
    try {
      const response = await axios.get("http://localhost:8000");
      console.log(response.data);
      Alert.alert('API Response', response.data.message); // Assuming the response has a message field
    } catch (error) {
      console.error('There was an error with the API call', error);
      Alert.alert('Error', 'Failed to fetch hello world message');
    }
}
  // const handleSend = async () => {
  //   if (!userInput.trim()) return; // Prevent sending empty messages
  //   // Temporary array to hold the new message and response for appending
  //   let newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
  //   const response = await apiCall(userInput, newChatHistory);
  //   if (response.success && response.data.length > 0) {
  //     // Append AI's response to the newChatHistory
  //     const aiResponse = response.data[response.data.length - 1]; // Assuming the last response is from AI
  //     newChatHistory.push(aiResponse);
  //     // Update the state to include the new messages
  //     setChatHistory(newChatHistory);
  //     setUserInput(''); // Clear input after sending
  //   } else {
  //     console.error(response.msg);
  //   }
  // };



  const handleSend = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user_input/", { input_text: userInput });
      console.log(response.data);
      Alert.alert('Success', 'User input sent successfully');
    } catch (error) {
      console.error('There was an error with the API call', error);
      Alert.alert('Error', 'Failed to send user input');
    }
  };

  // const fetchTodos = async () => {
  //   const response = await fetch("http://localhost:8000/todo")
  //   const todos = await response.json()
  //   console.log(todos.data)
  // }
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background-beach.png')} style={styles.bgImage}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>

        {/* Test Hello World Button */}
        <TouchableOpacity onPress={fetchHelloWorld} style={styles.testButton}>
          <Text style={styles.testButtonText}>Test Hello World</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={fetchTodos} style={styles.testButton}>
          <Text style={styles.testButtonText}>Test Fetch</Text>
        </TouchableOpacity> */}

        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((msg, index) => (
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
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
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
    top: 80, // Adjusted for visibility
    left: 20,
    backgroundColor: "#DDD",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
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
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF", // Set input background to white
    marginBottom: 40
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