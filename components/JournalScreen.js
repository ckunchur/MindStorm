import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,Keyboard} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, serverTimestamp, addDoc, doc, setDoc } from 'firebase/firestore';
import { generateRandomSessionID } from "../firebase/functions";
import { db } from '../firebaseConfig';
import { upsertSingleEntry } from "../Pinecone/pinecone-requests";
import { topMoodsAndTopicsWithChatGPT, moodWeatherClassificationWithChatGPT, recommendTherapyChatbotWithChatGPT } from '../OpenAI/OpenAI';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES} from '../styles/globalStyles';
import { useUser } from "../contexts/UserContext";

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function JournalScreen() {
  const { userId } = useUser(); // pulled from global state
  // const userId = "imIQfhTxJteweMhIh88zvRxq5NH2" // hardcoded 


  const navigation = useNavigation();
  const [entryText, setEntryText] = useState("");
  const [topTopics, setTopTopics] = useState([]);
  const [topMoods, setTopMoods] = useState([]);
  const [weatherMood, setWeatherMood] = useState("");
  const [botRecommendation, setBotRecommendation] = useState("");

  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) {
    return null;
  }
  console.log('userid on journal screen', userId);
  const handleEntrySubmit = async (uid) => {
    if (!uid) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }
    if (!entryText.trim()) {
      Alert.alert("Error", "Entry text cannot be empty.");
      return;
    }
  
    try {
      // Run OpenAI API calls FOR JOURNAL SUMMARY
      const results = await Promise.all([
        topMoodsAndTopicsWithChatGPT(entryText),
        moodWeatherClassificationWithChatGPT(entryText),
        recommendTherapyChatbotWithChatGPT(entryText),
      ]);
      // Update state with results from API calls FOR JOURNAL SUMMARY
      const [topMoodsAndTopicsResult, moodWeatherClassificationResult, recommendTherapyChatbotResult] = results;
      console.log("Top Moods and Topics Result:", topMoodsAndTopicsResult);
      console.log("Mood Weather Classification Result:", moodWeatherClassificationResult);
      console.log("Recommend Therapy Chatbot Result:", recommendTherapyChatbotResult);
      
      const topTopics = topMoodsAndTopicsResult.success && Array.isArray(topMoodsAndTopicsResult.data) ? topMoodsAndTopicsResult.data[0] || [] : [];
      const topMoods = topMoodsAndTopicsResult.success && Array.isArray(topMoodsAndTopicsResult.data) ? topMoodsAndTopicsResult.data[1] || [] : [];
      
      setTopTopics(topTopics);
      setTopMoods(topMoods);
      setWeatherMood(moodWeatherClassificationResult.success ? moodWeatherClassificationResult.data : "");
      setBotRecommendation(recommendTherapyChatbotResult.success ? recommendTherapyChatbotResult.data : "");
  
      // Firebase: Create a new entry in the "entries" collection for the user
      const docID = generateRandomSessionID();
      const docRef = doc(db, `users/${uid}/entries`, docID);
      await setDoc(docRef, {
        entryText: entryText,
        topTopics: topTopics,
        topMoods: topMoods,
        weatherMood: moodWeatherClassificationResult.success ? moodWeatherClassificationResult.data : "",
        botRecommendation: recommendTherapyChatbotResult.success ? recommendTherapyChatbotResult.data : "",
        timeStamp: serverTimestamp(),
      });
  
      // Navigate to the 'JournalSummary' screen after the weekly analysis is completed
      navigation.navigate('JournalSummary', {
        topTopics: topTopics,
        topMoods: topMoods,
        weatherMood: moodWeatherClassificationResult.success ? moodWeatherClassificationResult.data : "",
        botRecommendation: recommendTherapyChatbotResult.success ? recommendTherapyChatbotResult.data : "",
        entryText: entryText
      });
      await upsertSingleEntry({id: docID, text: entryText });
  
      setEntryText(""); // Clear the input field after successful submission
    } catch (error) {
      console.error("Error submitting entry: ", error);
      Alert.alert("Submission Failed", "Failed to save your entry. Please try again.");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.fullScreenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            resizeMode="cover"
            source={IMAGES.gradientbg}
            style={styles.fullScreen}
          >
            <WelcomeTitle title="How are you, really?" style={styles.title} />
            <WelcomeMessage
              message="Write about your day, your thoughts, or anything that's on your mind."
              style={styles.subheaderText}
            />

            <TextInput
              placeholder="Start writing here"
              value={entryText}
              onChangeText={setEntryText}
              style={styles.input}
              placeholderTextColor="grey"
              multiline={true}
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => handleEntrySubmit(userId)}
            >
              <Text style={styles.continueButtonText}>Submit</Text>
            </TouchableOpacity>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  fullScreenContainer: {
    flex: 1, // Make the container fill the whole screen
  },
  fullScreen: {
    flex: 1, // Make the background image fill the whole screen
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    position: 'absolute',
    top: 150,
    color: COLORS.maintextcolor,
    fontSize: 32,
    marginBottom: 10,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  subheaderText: {
    position: 'absolute',
    top: 200,
    textAlign: 'center',
    width: '80%',
    color: COLORS.secondarytextcolor,
    fontSize: 16,
    fontFamily:"Inter-Regular",
  },

  inputSubheader: {
    color: "white",
    fontSize: 16,
    fontFamily:"Inter-Regular",
  },
  inputHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: "Inter-Regular",
  },

  input: {
    marginTop: 180,
    height: '40%',
    width: '80%',
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingLeft: 20,
    paddingTop: 20, 
    paddingBottom: 20,
    paddingRight: 20,
    color: 'grey',

  },

  continueButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: 'white',
    position: "relative",
    width: "100%",
    maxWidth: 327,
    borderColor: COLORS.mindstormLightBlue,
    borderWidth: 1,
    textAlign: "center",
    marginTop: 36,
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily:"Inter-Regular",
  },
  
  continueButtonText: {
    color: COLORS.maintextcolor,
    fontFamily: "Inter-Medium"
  },
});