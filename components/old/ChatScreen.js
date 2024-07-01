import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiCall, apiRAGCall } from '../../OpenAI/OpenAI';
import { Ionicons } from '@expo/vector-icons';
import { writeChatHistoryToFirebase, ExtractUserProfileFromFirebase, generateRandomSessionID , ExtractLatestWeeklyAnalysisFromFirebase} from '../../firebase/functions';
import { lyra_prompt, lyra_greeting, nimbus_greeting, nimbus_prompt, Solara_prompt, Solara_greeting} from '../../OpenAI/prompts';
import { testUser } from '../../firebase/functions';
import { buddies } from '../../data/optionSettings';
import { upsertSingleChat, upsertEntry } from '../../Pinecone/pinecone-requests';
import { useUser } from '../../contexts/UserContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useGlobalFonts } from '../../styles/globalFonts';
import { COLORS, IMAGES } from '../../styles/globalStyles';

export default function ChatScreen() {
    const { userId } = useUser(); // pulled from global state

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
    // Chat instructions based on bot
    useEffect(() => {
        const initializeChatHistory = async () => {
            const userProfile = await ExtractUserProfileFromFirebase(userId);
            // Fetch the latest weekly analysis for the user
            const latestWeeklyAnalysis = await ExtractLatestWeeklyAnalysisFromFirebase(userId);
            let instructionPromptContent = "";
            let greetingPromptContent = "";
    
            // Prepare the latest weekly analysis for inclusion in the prompt
            let weeklyAnalysisSummaryPrompt = "";
            if (latestWeeklyAnalysis) {
                // Format the weekly analysis as needed, for example:
               
                weeklyAnalysisSummaryPrompt = `Here's your latest weekly analysis: ${latestWeeklyAnalysis.weeklongSummary} (from ${new Date(latestWeeklyAnalysis.timeStamp.seconds * 1000).toLocaleDateString()})`;
            } else {
                weeklyAnalysisSummaryPrompt = "It seems like we don't have a weekly analysis for you yet.";
            }
    
           

            const generalpromptending = "Make sure to use the user's name if available. DON'T NEED TO BRING UP THE CONTEXT UNLESS IT IS NATURAL AND RELEVANT. Keep answers comforting and short to medium length, whatever is needed to fully comfort and reassure. EMPHASIZE CONVERSATION FLOW. MAKE IT SOUND NATURAL AND FRIENDLY. FOCUS MOSTLY ON THE LAST USER INPUT AND RESPOND TO THAT. "
            const Solarapromptending = "Make sure to use the user's name if available. EMPHASIZE CONVERSATION FLOW. MAKE IT SOUND NATURAL AND FRIENDLY. FOCUS MOSTLY ON THE LAST USER INPUT AND RESPOND TO THAT. "

            // Setting instruction and greeting prompts based on the bot name

            switch (bot) {
                case "Lyra":
                    instructionPromptContent = `Context about user: ${userProfile}. System instructions: ${lyra_prompt}`+generalpromptending;
                    greetingPromptContent = lyra_greeting;
                    break;
                case "Nimbus":
                    instructionPromptContent = `Context about user: ${userProfile}. System instructions: ${nimbus_prompt}`+generalpromptending;
                    greetingPromptContent = nimbus_greeting;
                    break;
                case "Solara": // Adjusted case for Solara to include weekly analysis summary
                    instructionPromptContent = `Context about user: ${userProfile}. ${weeklyAnalysisSummaryPrompt} System instructions: ${Solara_prompt}.`+Solarapromptending;
                    greetingPromptContent = Solara_greeting;
                    break;
                // Additional cases for other bots can be added here
            }
            
            const instructionPrompt = {
                role: 'system',
                content: instructionPromptContent,
            };
            setInstructionPromptString(instructionPrompt.content);
    
            const greetingPrompt = { 
                role: 'system', 
                content: greetingPromptContent,
            };
    
            if (entryText) {
                setUserInput(entryText);
                setChatHistory([instructionPrompt]);
            } else {
                setChatHistory([instructionPrompt, greetingPrompt]);
            }
        };
        initializeChatHistory();
    }, []);
    const [sessionID, setSessionID] = useState("");

    const handleSend = async () => {
        if (!userInput.trim()) return; // Prevent sending empty messages

        let response;
        // don't need RAG for basic productivity bot
        if (bot === "Nimbus") {
            response = await apiCall(userInput, chatHistory);
        }
        if (bot === "Solara") {
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
            setChatHistory(newChatHistory);
            if (sessionID === "") {

                const newSessionID = generateRandomSessionID(); // Implement this function to generate a unique ID
                console.log(newSessionID);
                console.log("in sessionid function", newSessionID);

                setSessionID(newSessionID);

            }
        } else {
            console.error(response.msg);
        }
    };

    const handleBackPress = async() => {
        const chatString = chatHistory.slice(1).map(message => `role: ${message.role}, content: "${message.content}"`).join('; ');
        // upsert whole chat history to Pinecone after exit
        console.log("chatstring", chatString);
        await upsertSingleChat([{ id: sessionID, messages: chatString }]);
        await writeChatHistoryToFirebase(userId, sessionID, chatHistory);
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
            <ImageBackground source={IMAGES.gradientbg} style={styles.bgImage}>
                <View style={styles.contentContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
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
                                        <Image source={bot === "Lyra" ? buddies[0].avatar : (bot === "Nimbus" ? buddies[1].avatar : buddies[2].avatar)
                                    } style={styles.botImage}></Image> : null}
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
                        <Ionicons name="send" color={COLORS.secondarytextcolor} size={36} />
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