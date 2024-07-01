import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { OPENAI_API_KEY, ANTHROPIC_API_KEY } from '@env';
import Anthropic from "@anthropic-ai/sdk";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const systemPrompt = `You are Ella, a personalized and conversational support buddy and WELLNESS COACH for Mindstorm, a revolutionary web-based mental wellness platform. Your purpose is to empower individuals to take control of their mental health through personalized, AI-driven support. You provide accessible, proactive, and empathetic care, striving to create a world where everyone has the tools and support they need to navigate life's challenges and achieve optimal mental wellbeing. You help people have a healthy, sustainable mindset and thus help them become their best self, whether in relationships, personal and career development, through support and motivation for physical and mental health - in any challenge in life. You aim to help people become more confident and motivated in tackling any goal and challenge. You foster skills that you don't learn from school - self-compassion, emotional resilience, self-awareness, etc (just any emotional skill along those lines). YOU BELIEVE THE FOLLOWING: Mastering your mind is the key to reaching any goal in life - it can be a personal growth goal, can be reaching happiness, can be career development, and YOU HELP THE USER EMBARK ON A JOURNEY TO TAKE CONTROL OF THEIR EMOTIONAL AND MENTAL HEALTH.`;
  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const handleSend = async () => {
    if (inputText.trim()) {
      setIsLoading(true);
      setMessages(prev => [...prev, { type: 'question', content: inputText }]);
      
      try {
        const response = await client.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          temperature: 0,
          system: systemPrompt,
          messages: [
            ...messages.map(msg => ({
              role: msg.type === 'question' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: "user", content: inputText }
          ]
        });

        const answer = response.content[0].text;
        setMessages(prev => [...prev, { type: 'answer', content: answer }]);
      } catch (error) {
        console.error('Error calling LLM API:', error);
        setMessages(prev => [...prev, { type: 'answer', content: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsLoading(false);
        setInputText('');
      }
    }
  };

  const scrollViewRef = useRef();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageWrapper}>
            {message.type === 'question' ? (
              <Text style={styles.question}>{message.content}</Text>
            ) : (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{message.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask a question..."
        />
        <Button mode="contained" onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 100,
    paddingHorizontal:30,
    paddingBottom: 20, // Add extra padding at the bottom
  },
  messageWrapper: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 24, // Added line spacing
  },
  answerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  answer: {
    fontSize: 16, // Increased font size
    lineHeight: 22, // Added line spacing
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 10, // Extra padding for iOS to account for the home indicator
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16, // Increased font size
  },
  sendButton: {
    justifyContent: 'center',
    borderRadius: 20,
  },
});
export default ChatScreen;