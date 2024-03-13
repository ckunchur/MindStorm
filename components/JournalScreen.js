import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { topMoodsAndTopicsWithChatGPT, moodWeatherClassificationWithChatGPT, recommendTherapyChatbotWithChatGPT } from '../OpenAI/OpenAI';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES} from '../styles/globalStyles';

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function JournalScreen() {
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
  const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2" // hardcoded for now

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
      const entriesRef = collection(db, `users/${uid}/entries`);
      await addDoc(entriesRef, {
        entryText: entryText,
        topTopics: topTopics,
        topMoods: topMoods,
        weatherMood: moodWeatherClassificationResult.success ? moodWeatherClassificationResult.data : "",
        botRecommendation: recommendTherapyChatbotResult.success ? recommendTherapyChatbotResult.data : "",
        timeStamp: serverTimestamp(), // Use Firestore's serverTimestamp for consistency
      });
  
      // Navigate to the 'JournalSummary' screen after the weekly analysis is completed
      navigation.navigate('JournalSummary', {
        topTopics: topTopics,
        topMoods: topMoods,
        weatherMood: moodWeatherClassificationResult.success ? moodWeatherClassificationResult.data : "",
        botRecommendation: recommendTherapyChatbotResult.success ? recommendTherapyChatbotResult.data : "",
      });
  
      setEntryText(""); // Clear the input field after successful submission
    } catch (error) {
      console.error("Error submitting entry: ", error);
      Alert.alert("Submission Failed", "Failed to save your entry. Please try again.");
    }
  };
  return (
    <View style={styles.fullScreenContainer}>
      <ImageBackground
        resizeMode="cover"
        source={IMAGES.gradientbg}
        style={styles.fullScreen}
      >
        <WelcomeTitle title="What's on your mind?" style={styles.title} />
        <WelcomeMessage message="This is your mind space. Write down anything you wish!" style={styles.subheaderText} />

        <TextInput
          placeholder="Start writing here"
          value={entryText}
          onChangeText={setEntryText}
          style={styles.input}
          placeholderTextColor="grey"
          multiline={true}
        />

        <TouchableOpacity style={styles.continueButton} onPress={() => handleEntrySubmit(testUser)}>
          <Text style={styles.continueButtonText}>Submit</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({

  fullScreenContainer: {
    flex: 1, // Make the container fill the whole screen
  },
  fullScreen: {
    flex: 1, // Make the background image fill the whole screen
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally
  },
  title: {
    position: 'absolute',
    top: 80,
    color: COLORS.mindstormGrey,
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "700",
    fontFamily: "Inter-SemiBold",
  },
  subheaderText: {
    position: 'absolute',
    top: 130,
    textAlign: 'center',
    width: '60%',
    color: COLORS.mindstormGrey,
    fontSize: 16,
    fontFamily:"Inter-Regular",
    // marginBottom: 50, // Adjust the value as needed
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
    height: '55%',
    width: '80%',
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'grey',

  },

  continueButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "#FFF",
    position: "relative",
    width: "100%",
    maxWidth: 327,
    color: COLORS.mindstormPurple,
    textAlign: "center",
    marginTop: 36,
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily:"Inter-Regular",
  },
  continueButtonText: {
    color: COLORS.mindstormGrey,
    fontWeight: 'bold'
  },
});