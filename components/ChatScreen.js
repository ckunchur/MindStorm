import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiCall, apiRAGCall } from '../OpenAI/OpenAI';
import { Ionicons } from '@expo/vector-icons';
import { writeChatHistoryToFirebase, ExtractUserProfileFromFirebase, generateRandomSessionID } from '../firebase/functions';
import { lyra_prompt, lyra_greeting, nimbus_greeting, nimbus_prompt } from '../OpenAI/prompts';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { testUser } from '../firebase/functions';
import { buddies } from '../data/optionSettings';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { bot, entryText } = route.params;
    const [userInput, setUserInput] = useState('');
    const [instructionPromptString, setInstructionPromptString] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const initializeChatHistory = async () => {
            const userProfile = await ExtractUserProfileFromFirebase(testUser);
            const instructionPrompt = {
                role: 'system',
                content: `Context about user: ${userProfile}. System instructions: ${bot === "Lyra" ? lyra_prompt : nimbus_prompt}`
            };
            setInstructionPromptString(instructionPrompt.content);
            const greetingPrompt = { role: 'system', content: `${bot === "Lyra" ? lyra_greeting : nimbus_greeting}` };
            if (entryText) {
                setUserInput(entryText);
                setChatHistory([instructionPrompt]);
            }
            else {

                setChatHistory([instructionPrompt, greetingPrompt]);
            }
        };
        initializeChatHistory();
    }, []);
    const [sessionID, setSessionID] = useState("");

    const handleSend = async () => {
        if (!userInput.trim()) return; // Prevent sending empty messages
        
        console.log("chatHistory in rag call", chatHistory, userInput, instructionPromptString)
        let response;
        // don't need RAG for basic productivity bot
        if (bot === "Nimbus") {
            response = await apiCall(userInput, chatHistory);
        }
        else {
            // response = await apiCall(userInput, chatHistory);

            response = await apiRAGCall(instructionPromptString, userInput, chatHistory);
        }
        setUserInput(''); // Clear input after sending
        if (response.success && response.data.length > 0) {
            const newMessages= response.data // append user prompt and gpt response
            const newChatHistory = [...chatHistory, ...newMessages];
            console.log("newChatHistory", newChatHistory);
            setChatHistory(newChatHistory);
            if (sessionID === "") {
                const newSessionID = generateRandomSessionID(); // Implement this function to generate a unique ID
                console.log("sessionid", newSessionID);
                setSessionID(newSessionID);
            }
            await writeChatHistoryToFirebase(testUser, sessionID, newChatHistory);
           
          
        } else {
            console.error(response.msg);
        }
    };

    const handleBackPress = () => {
        setSessionID(""); // reset session ID
        setChatHistory([]); // reset chat history if starting fresh next time
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={bot === "Lyra" ? buddies[0].chatBackground : buddies[1].chatBackground} style={styles.bgImage}> */}
            <ImageBackground
                    resizeMode="cover"
                    source={require('../assets/gradient3.jpeg')}
                    style={styles.fullScreen}
                >
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
                </TouchableOpacity>
                <ScrollView style={styles.chatContainer}>
                    {chatHistory.length < 2 ? null :
                        chatHistory.slice(1).map((msg, index) => (
                            <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                                {msg.role !== 'user' ?
                                <Image source={bot === "Lyra" ? buddies[0].avatar : buddies[1].avatar} style={styles.botImage}></Image> : null}
                                <Text style={[styles.bubbleText, { color: msg.role === 'user' ? '#ffffff' : '#000000' }]}>{msg.content}</Text>
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
    bubbleText: {
        maxWidth: '80%',
        padding: 4
    },
    fullScreen: {
        flex: 1, // Make the background image fill the whole screen
        width: '100%',
        height: '100%',
      },
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
    botImage: {
        backgroundColor: 'black',
        borderRadius: 12,
        width: windowWidth * 0.08,
        height: windowHeight * 0.04,
        padding: 8,
        marginRight: 4,
    },
    backButton: {
        position: 'absolute',
        top: 80, // Adjusted to be below status bar
        left: 20,
        zIndex: 10, // Ensure the back button is above the chat bubbles
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
        backgroundColor: "#FFF",
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
        marginTop: 120,
    },
    bubble: {
        display: 'flex',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: '95%',
        display: 'flex',
        flexDirection: 'row',
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