import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiCall } from './OpenAi'; // Ensure this path is correct for your project setup

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    const messages = chatHistory.map((msg) => ({ role: msg.role, content: msg.content }));
    const response = await apiCall(userInput, messages);
    if (response.success) {
      setChatHistory(response.data);
      setUserInput(''); // Clear input after sending
    } else {
      console.error(response.msg);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background-beach.png')} style={styles.bgImage}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>

        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((msg, index) => (
            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text>{msg.content}</Text>
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
          {/* Replacing Button with TouchableOpacity for the Send action */}
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
    marginBottom: 40,
    backgroundColor: "#DDD",
  },
  sendButton: {
    backgroundColor: '#007bff', // A nice shade of blue
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 40
  },
  sendButtonText: {
    color: '#ffffff', // White color for the text
  },
  chatContainer: {
    flex: 1,
    marginTop: 120,
    padding: 10
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#daf8cb',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
  }
});
