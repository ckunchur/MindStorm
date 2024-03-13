import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiCall, apiRAGCall } from '../OpenAI/OpenAI';
import { Ionicons } from '@expo/vector-icons';
import { writeChatHistoryToFirebase, ExtractUserProfileFromFirebase, generateRandomSessionID } from '../firebase/functions';
import { lyra_prompt, lyra_greeting, nimbus_greeting, nimbus_prompt } from '../OpenAI/prompts';
import { testUser } from '../firebase/functions';
import { buddies } from '../data/optionSettings';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS } from '../styles/globalStyles';

export default function ChatScreen() {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) {
        return null;
    }
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
            const newMessages = response.data // append user prompt and gpt response
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <ImageBackground source={require('../assets/gradient3.jpeg')} style={styles.bgImage}>
                <View style={styles.contentContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightGrey} size={48} />
                    </TouchableOpacity>
                    <ScrollView
                        style={styles.chatContainer}
                        ref={ref => this.scrollViewRef = ref}
                        onContentSizeChange={() => this.scrollViewRef.scrollToEnd({ animated: true })}
                    >
                        {chatHistory.length < 2 ? null :
                            chatHistory.slice(1).map((msg, index) => (
                                <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                                    {msg.role !== 'user' ?
                                        <Image source={bot === "Lyra" ? buddies[0].avatar : buddies[1].avatar} style={styles.botImage}></Image> : null}
                                    <Text style={[styles.bubbleText, { color: msg.role === 'user' ? '#ffffff' : '#000000' }]}>{msg.content}</Text>
                                </View>
                            ))}
                    </ScrollView>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUserInput}
                        value={userInput}
                        placeholder="Type your message..."
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <Ionicons name="send" color={COLORS.mindstormLightGrey} size={36} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    bubbleText: {
        maxWidth: '80%',
        padding: 4,
        fontFamily: "Inter-Regular"
    },
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        padding: 20,
    },
    contentContainer: {
        marginTop:20,
        flex: 1,
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
        top: 30,
        zIndex: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
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
        fontFamily: "Inter-Regular"
    },
    chatContainer: {
        flex: 1,
        marginTop: 80,
        paddingBottom: 20,
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
        backgroundColor: COLORS.mindstormPurple,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
    },
});