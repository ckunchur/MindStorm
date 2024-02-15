import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { apiCall } from '../api/openAI';
import Features from '../components/features';
import Tts from 'react-native-tts';

const App = () => {
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();
  const [text, setText] = useState('');

  

  const handleSendText = async () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      setLoading(true);
      setText(''); // Clear the text input field immediately
      const newMessages = [...messages, { role: 'user', content: trimmedText }];
      setMessages(newMessages); // Update the messages list
      updateScrollView();
  
      try {
        const response = await apiCall(trimmedText, newMessages); // Ensure apiCall is awaited
        if (response.success) {
          setMessages(response.data); // Update with the new messages including the response
          //startTextToSpeech(response.data[response.data.length - 1].content); // Speak out the latest message
        } else {
          Alert.alert('Error', response.msg);
        }
      } catch (error) {
        console.error('error:', error);
        //Alert.alert('Error', 'Failed to get response from API');
      } finally {
        setLoading(false); // Ensure loading is set to false once the operation is complete
      }
    }
  };
  

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ',e);
    const text = e.value[0];
    setResult(text);
    
  };

  const speechErrorHandler = e=>{
    console.log('speech error: ',e);
  }

  
  const startRecording = async () => {
    setRecording(true);
    Tts.stop(); 
    try {
      await Voice.start('en-GB'); // en-US

    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      const trimmedText = result.trim();
      if (trimmedText) {
        const newMessages = [...messages, { role: 'user', content: trimmedText }];
        setMessages(newMessages);
        fetchResponse(trimmedText, newMessages); // Pass the trimmed result and the updated messages list
      }
      setRecording(false);
    } catch (error) {
      console.error('stopRecording error:', error);
    }
  };
  
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async (inputText, currentMessages) => {
    if (inputText.trim().length > 0) {
      try {
        setLoading(true);
        // Since we are passing currentMessages, we don't need to recreate it
        // Just directly pass it to the apiCall function
        const response = await apiCall(inputText.trim(), currentMessages);

  
        if (response.success) {
          // If the API call is successful, set the messages state to the updated messages array
          // This should include both the user's message and the assistant's response
          setMessages(response.data);
          
          // After updating the messages, scroll to the latest message
          updateScrollView();
  
          // If the response includes content to be spoken, use TTS
          // Find the last message from the assistant to speak out
          const lastMessage = response.data.find((msg) => msg.role === 'assistant');
          if (lastMessage && lastMessage.content) {
            startTextToSpeech(lastMessage.content);
          }
        } else {
          Alert.alert('Error', response.msg);
        }
      } catch (error) {
        console.error('API call failed:', error);
        Alert.alert('Error', 'Failed to get response from API');
      } finally {
        setLoading(false); // Turn off the loading indicator regardless of the outcome
      }
    }
  };



  const updateScrollView = ()=>{
    setTimeout(()=>{
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    },200)
  }

  const startTextToSpeech = message => {
    // Ensure message.content is defined before calling includes
    if (message && message.content && !message.content.includes('https')) {
      setSpeaking(true);
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.5,
      });
    }
  };
  
  

  const stopSpeaking = ()=>{
    Tts.stop();
    setSpeaking(false);
  }

  const sendMessageOrRecord = () => {
    if (recording) {
      stopRecording();
    } else if (text.trim()) {
      handleSendText();
    } else {
      startRecording();
    }
  };

  useEffect(() => {

    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;
    
    // text to speech events
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {console.log('finish', event); setSpeaking(false)});
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    
    
    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centeredView}>
            <Image
              source={require('../../assets/images/bot.png')}
              style={styles.botIcon}
            />
          </View>
  
          {messages.length > 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.assistantText}>Ella</Text>
  
              <View style={styles.messagesView}>
                <ScrollView
                  ref={scrollViewRef}
                  bounces={false}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {messages.map((message, index) => (
                    message.role === 'assistant' ? (
                      message.content.includes('https') ? (
                        <View key={index} style={styles.messageBubbleLeft}>
                          <Image
                            source={{ uri: message.content }}
                            style={styles.messageImage}
                            resizeMode="contain"
                          />
                        </View>
                      ) : (
                        <View key={index} style={styles.messageBubbleLeft}>
                          <Text style={styles.messageText}>
                            {message.content}
                          </Text>
                        </View>
                      )
                    ) : (
                      <View key={index} style={styles.messageBubbleRight}>
                        <Text style={styles.messageText}>
                          {message.content}
                        </Text>
                      </View>
                    )
                  ))}
                </ScrollView>
              </View>
            </View>
          ) : (
            <Features />
          )}
  
         {/* Text input and microphone button */}
         <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={setText}
            value={text}
            placeholder="How are you feeling today?"
            placeholderTextColor="gray"
            onSubmitEditing = {handleSendText}
          />
          <TouchableOpacity onPress={sendMessageOrRecord} style={styles.microphoneButtonContainer}>
            {recording ? (
              <Image
                source={require('../../assets/images/voiceLoading.gif')}
                style={styles.microphoneButton}
              />
            ) : (
              <Image
                source={require('../../assets/images/recordingIcon.png')}
                style={styles.microphoneButton}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Loading, clear, and stop buttons */}
        <View style={styles.buttonsContainer}>
          {loading && (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={styles.microphoneButton}
            />
          )}

          {messages.length > 0 && (
            <TouchableOpacity onPress={clear} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity onPress={stopSpeaking} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    safeArea: {
      flex: 1,
      marginHorizontal: wp(5),
      marginBottom: wp(5),
    },
    centeredView: {
      alignItems: 'center',
    },
    botIcon: {
      height: hp(15),
      width: hp(15),
    },
    messageContainer: {
      flex: 1,
      marginTop: hp(2),
    },
    assistantText: {
      color: 'gray',
      fontWeight: 'bold',
      marginLeft: wp(1),
      fontSize: wp(5),
    },
    messagesView: {
      height: hp(58),
      backgroundColor: '#e5e5e5',
      borderRadius: 25,
      padding: hp(2),
    },
    scrollView: {
      marginVertical: hp(1),
    },
    messageBubbleLeft: {
      justifyContent: 'flex-start',
      
    },
    messageBubbleRight: {
      justifyContent: 'flex-end',
    },
    messageText: {
      fontSize: wp(4),
    },
    messageImage: {
      height: wp(60),
      width: wp(60),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 20,
      padding: 8,
      marginHorizontal: 8,
      marginBottom: 8,
    },
    textInput: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      fontSize: 16,
      color: 'black',
    },
    microphoneButton: {
      padding: 10,
      width: 40, // Adjust the width to match the icon size
      height: 40, // Adjust the height to match the icon size
    },
  });

export default App;