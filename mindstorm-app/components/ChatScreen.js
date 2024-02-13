import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  }
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatScreen() {
  const [response, setResponse] = useState('');
  const navigation = useNavigation();

  const fetchAIResponse = async () => {
    const messages = [{
      role: 'user',
      content: "Once upon a time",
    }];
    try {
      const result = await client.post('/chat/completions', {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 20, // Adjusted for a shorter response
      });
      const reply = result.data.choices[0].message.content.trim();
      setResponse(reply);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../assets/background-beach.png')}
          style={styles.bgImage}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text>OpenAI API Test?</Text>
        <Button title="Generate AI Text" onPress={fetchAIResponse} />
        <Text>Response: {response}</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute', 
        top: 120, 
        left: 20, 
        backgroundColor: "#DDD",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
      },
});
