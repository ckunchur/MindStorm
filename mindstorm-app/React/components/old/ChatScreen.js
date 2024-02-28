import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ImageBackground, Dimensions,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiCall } from './OpenAi';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import TypingPreviewBox from './TypingPreview';
import { writeChatHistoryToFirebase } from '../../firebase/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const userId = "2Plv4ZA1wvY4pdkQyicn";

export default function ChatScreen() {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  const [showPreview, setShowPreview] = useState(false); // State to manage showing/hiding the typing preview
  const [chatHistory, setChatHistory] = useState([]);


  async function chatHistoryHandler() {
    await writeChatHistoryToFirebase(userId, chatHistory);
    navigation.goBack();
  }
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
      console.log(newChatHistory);
      setUserInput(''); // Clear input after sending
      setShowPreview(false); // Hide the typing preview box when message is sent
    } else {
      console.error(response.msg);
    }
  };

  return (
    // <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
    <ImageBackground source={require('../assets/background-beach.png')} style={styles.landingImage} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableOpacity onPress={chatHistoryHandler} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
      </TouchableOpacity>

      <View>


        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((msg, index) => (
            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={{ color: msg.role === 'user' ? '#ffffff' : '#000000' }}>{msg.content}</Text>
            </View>
          ))}
        </ScrollView>

        {showPreview && (
          <TypingPreviewBox
            text={userInput}
            onChangeText={setUserInput}
            onClose={() => setShowPreview(false)}
            onSend={handleSend}
          />
        )}

        {!showPreview && ( // Only show the Send Message button if the preview box is not visible
          <TouchableOpacity onPress={() => setShowPreview(true)} style={styles.sendMessageButton}>
            <Ionicons name="send" size={24} color="#4A9BB4" />
            <Text style={{ color: '#4A9BB4', fontWeight: 'bold', marginLeft: 2 }}> Send Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({

  landingImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight * 1.02,
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 80, // Adjusted to be below status bar
    left: 20,
    zIndex: 10, // Ensure the back button is above the chat bubbles
  },
  backButtonText: {
    fontWeight: 'bold',
    color: '#4A9BB4',
    textAlign: 'center',
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
  sendMessageButton: {
    position: 'absolute',
    bottom: 4,
    left: 30,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
});
