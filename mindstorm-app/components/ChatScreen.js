import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiCall } from './OpenAi';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');


  // Initialize chatHistory as an empty array 
  const [chatHistory, setChatHistory] = useState([]);
  const handleSend = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages
    // Temporary array to hold the new message and response for appending
    let newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    const response = await apiCall(userInput, newChatHistory);
    if (response.success && response.data.length > 0) {
      // Append AI's response to the newChatHistory
      const aiResponse = response.data[response.data.length - 1]; // Assuming the last response is from AI
      newChatHistory.push(aiResponse);
      // Update the state to include the new messages
      setChatHistory(newChatHistory);
      setUserInput(''); // Clear input after sending
    } else {
      console.error(response.msg);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background-beach.png')} style={styles.bgImage}>

        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>

        {/* Chat bubbles - only the last message from chathistory adds to the bubbles */}
        <ScrollView style={styles.chatContainer}>
          {/* Render each message in chatHistory as a bubble */}
          {chatHistory.map((msg, index) => (
            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={{ color: msg.role === 'user' ? '#ffffff' : '#000000' }}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input keyboard (has voice) and send button */}
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
    top: 90,
    left: 20,
    backgroundColor: "#DDD",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
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
