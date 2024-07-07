// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Image, Text, ImageBackground, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { apiCall, apiRAGCall } from '../OpenAI/OpenAI';
// import { Ionicons } from '@expo/vector-icons';
// import { writeChatHistoryToFirebase, ExtractUserProfileFromFirebase, generateRandomSessionID , ExtractLatestWeeklyAnalysisFromFirebase} from '../firebase/functions';
// import { lyra_prompt, lyra_greeting, nimbus_greeting, nimbus_prompt, Solara_prompt, Solara_greeting} from '../OpenAI/prompts';
// import { testUser } from '../firebase/functions';
// import { buddies } from '../data/optionSettings';
// import { upsertSingleChat, upsertEntry } from '../Pinecone/pinecone-requests';
// import { useUser } from '../contexts/UserContext';
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// import { useGlobalFonts } from '../styles/globalFonts';
// import { COLORS, IMAGES } from '../styles/globalStyles';

// export default function ChatScreen() {
//     const { userId } = useUser(); // pulled from global state

//     const fontsLoaded = useGlobalFonts();
//     if (!fontsLoaded) {
//         return null;
//     }
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { bot, entryText } = route.params;
//     const [userInput, setUserInput] = useState('');
//     const [instructionPromptString, setInstructionPromptString] = useState("");
//     const [chatHistory, setChatHistory] = useState([]);
//     // Chat instructions based on bot
//     useEffect(() => {
//         const initializeChatHistory = async () => {
//             const userProfile = await ExtractUserProfileFromFirebase(userId);
//             // Fetch the latest weekly analysis for the user
//             const latestWeeklyAnalysis = await ExtractLatestWeeklyAnalysisFromFirebase(userId);
//             let instructionPromptContent = "";
//             let greetingPromptContent = "";
    
//             // Prepare the latest weekly analysis for inclusion in the prompt
//             let weeklyAnalysisSummaryPrompt = "";
//             if (latestWeeklyAnalysis) {
//                 // Format the weekly analysis as needed, for example:
               
//                 weeklyAnalysisSummaryPrompt = `Here's your latest weekly analysis: ${latestWeeklyAnalysis.weeklongSummary} (from ${new Date(latestWeeklyAnalysis.timeStamp.seconds * 1000).toLocaleDateString()})`;
//             } else {
//                 weeklyAnalysisSummaryPrompt = "It seems like we don't have a weekly analysis for you yet.";
//             }
    
           

//             const generalpromptending = "Make sure to use the user's name if available. DON'T NEED TO BRING UP THE CONTEXT UNLESS IT IS NATURAL AND RELEVANT. Keep answers comforting and short to medium length, whatever is needed to fully comfort and reassure. EMPHASIZE CONVERSATION FLOW. MAKE IT SOUND NATURAL AND FRIENDLY. FOCUS MOSTLY ON THE LAST USER INPUT AND RESPOND TO THAT. "
//             const Solarapromptending = "Make sure to use the user's name if available. EMPHASIZE CONVERSATION FLOW. MAKE IT SOUND NATURAL AND FRIENDLY. FOCUS MOSTLY ON THE LAST USER INPUT AND RESPOND TO THAT. "

//             // Setting instruction and greeting prompts based on the bot name

//             switch (bot) {
//                 case "Lyra":
//                     instructionPromptContent = `Context about user: ${userProfile}. System instructions: ${lyra_prompt}`+generalpromptending;
//                     greetingPromptContent = lyra_greeting;
//                     break;
//                 case "Nimbus":
//                     instructionPromptContent = `Context about user: ${userProfile}. System instructions: ${nimbus_prompt}`+generalpromptending;
//                     greetingPromptContent = nimbus_greeting;
//                     break;
//                 case "Solara": // Adjusted case for Solara to include weekly analysis summary
//                     instructionPromptContent = `Context about user: ${userProfile}. ${weeklyAnalysisSummaryPrompt} System instructions: ${Solara_prompt}.`+Solarapromptending;
//                     greetingPromptContent = Solara_greeting;
//                     break;
//                 // Additional cases for other bots can be added here
//             }
            
//             const instructionPrompt = {
//                 role: 'system',
//                 content: instructionPromptContent,
//             };
//             setInstructionPromptString(instructionPrompt.content);
    
//             const greetingPrompt = { 
//                 role: 'system', 
//                 content: greetingPromptContent,
//             };
    
//             if (entryText) {
//                 setUserInput(entryText);
//                 setChatHistory([instructionPrompt]);
//             } else {
//                 setChatHistory([instructionPrompt, greetingPrompt]);
//             }
//         };
//         initializeChatHistory();
//     }, []);
//     const [sessionID, setSessionID] = useState("");

//     const handleSend = async () => {
//         if (!userInput.trim()) return; // Prevent sending empty messages

//         let response;
//         // don't need RAG for basic productivity bot
//         if (bot === "Nimbus") {
//             response = await apiCall(userInput, chatHistory);
//         }
//         if (bot === "Solara") {
//             response = await apiCall(userInput, chatHistory);
//         }
//         else {
//             // response = await apiCall(userInput, chatHistory);
//             response = await apiRAGCall(instructionPromptString, userInput, chatHistory);

//         }
//         setUserInput(''); // Clear input after sending
//         if (response.success && response.data.length > 0) {
//             const newMessages = response.data // append user prompt and gpt response
//             const newChatHistory = [...chatHistory, ...newMessages];
//             setChatHistory(newChatHistory);
//             if (sessionID === "") {

//                 const newSessionID = generateRandomSessionID(); // Implement this function to generate a unique ID
//                 console.log(newSessionID);
//                 console.log("in sessionid function", newSessionID);

//                 setSessionID(newSessionID);

//             }
//         } else {
//             console.error(response.msg);
//         }
//     };

//     const handleBackPress = async() => {
//         const chatString = chatHistory.slice(1).map(message => `role: ${message.role}, content: "${message.content}"`).join('; ');
//         // upsert whole chat history to Pinecone after exit
//         console.log("chatstring", chatString);
//         await upsertSingleChat([{ id: sessionID, messages: chatString }]);
//         await writeChatHistoryToFirebase(userId, sessionID, chatHistory);
//         setSessionID(""); // reset session ID
//         setChatHistory([]); // reset chat history if starting fresh next time
//         navigation.goBack();
//     };

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
//         >
//             <ImageBackground source={IMAGES.gradientbg} style={styles.bgImage}>
//                 <View style={styles.contentContainer}>
//                     <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
//                         <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
//                     </TouchableOpacity>
//                     <ScrollView
//                         style={styles.chatContainer}
//                         ref={ref => this.scrollViewRef = ref}
//                         onContentSizeChange={() => this.scrollViewRef.scrollToEnd({ animated: true })}
//                     >
//                         {chatHistory.length < 2 ? null :
//                             chatHistory.slice(1).map((msg, index) => (
//                                 <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
//                                     {msg.role !== 'user' ?
//                                         <Image source={bot === "Lyra" ? buddies[0].avatar : (bot === "Nimbus" ? buddies[1].avatar : buddies[2].avatar)
//                                     } style={styles.botImage}></Image> : null}
//                                     <Text style={[styles.bubbleText, { color: msg.role === 'user' ? '#ffffff' : '#000000' }]}>{msg.content}</Text>
//                                 </View>
//                             ))}
//                     </ScrollView>
//                 </View>
//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         style={styles.input}
//                         onChangeText={setUserInput}
//                         value={userInput}
//                         placeholder="Type your message..."
//                     />
//                     <TouchableOpacity onPress={handleSend}>
//                         <Ionicons name="send" color={COLORS.secondarytextcolor} size={36} />
//                     </TouchableOpacity>
//                 </View>
//             </ImageBackground>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     bubbleText: {
//         maxWidth: '80%',
//         padding: 4,
//         fontFamily: "Inter-Regular"
//     },
//     container: {
//         flex: 1,
//     },
//     bgImage: {
//         flex: 1,
//         width: windowWidth,
//         height: windowHeight,
//         padding: 20,
//     },
//     contentContainer: {
//         marginTop:20,
//         flex: 1,
//     },
//     botImage: {
//         width: windowWidth * 0.08,
//         height: windowHeight * 0.04,
//         padding: 8,
//         marginRight: 4,
//     },
//     backButton: {
//         position: 'absolute',
//         top: 30,
//         zIndex: 10,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 5,
//     },
//     input: {
//         flex: 1,
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginRight: 10,
//         borderRadius: 24,
//         paddingHorizontal: 10,
//         backgroundColor: "#FFF",
//         fontFamily: "Inter-Regular"
//     },
//     chatContainer: {
//         flex: 1,
//         marginTop: 80,
//         paddingBottom: 20,
//     },
//     bubble: {
//         display: 'flex',
//         flexDirection: 'row',
//         padding: 12,
//         borderRadius: 20,
//         marginBottom: 10,
//         maxWidth: '95%',
//         display: 'flex',
//         flexDirection: 'row',
//     },
//     userBubble: {
//         alignSelf: 'flex-end',
//         backgroundColor: COLORS.mindstormBlue,
//     },
//     aiBubble: {
//         alignSelf: 'flex-start',
//         backgroundColor: '#ffffff',
//     },
// });

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { OPENAI_API_KEY, EXPO_PUBLIC_ANTHROPIC_API_KEY } from '@env';
import Anthropic from "@anthropic-ai/sdk";
import { IMAGES, COLORS } from '../styles/globalStyles'; // Adjust the path as necessary

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const systemPrompt = `You are Ella, a personalized and conversational support buddy and WELLNESS COACH for Mindstorm, a revolutionary web-based mental wellness platform. Your purpose is to empower individuals to take control of their mental health through personalized, AI-driven support. You provide accessible, proactive, and empathetic care, striving to create a world where everyone has the tools and support they need to navigate life's challenges and achieve optimal mental wellbeing. You help people have a healthy, sustainable mindset and thus help them become their best self, whether in relationships, personal and career development, through support and motivation for physical and mental health - in any challenge in life. You aim to help people become more confident and motivated in tackling any goal and challenge. You foster skills that you don't learn from school - self-compassion, emotional resilience, self-awareness, etc (just any emotional skill along those lines). YOU BELIEVE THE FOLLOWING: Mastering your mind is the key to reaching any goal in life - it can be a personal growth goal, can be reaching happiness, can be career development, and YOU HELP THE USER EMBARK ON A JOURNEY TO TAKE CONTROL OF THEIR EMOTIONAL AND MENTAL HEALTH.`;
  const client = new Anthropic({
    apiKey: EXPO_PUBLIC_ANTHROPIC_API_KEY,
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
      <ImageBackground source={IMAGES.gradientbg} style={styles.bgImage}>
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
          <Button mode="contained" onPress={handleSend} style={styles.sendButton} disabled={isLoading} theme={{ colors: { primary: COLORS.mindstormBlue } }}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 100,
    paddingHorizontal: 30,
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
    color: COLORS.mindstormBlue
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
