import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { topMoodsAndTopicsWithChatGPT, moodWeatherClassificationWithChatGPT, recommendTherapyChatbotWithChatGPT } from '../OpenAI/OpenAI';
import { testUser } from "../firebase/functions";

export default function JournalScreen() {
  const navigation = useNavigation();
  const [entryText, setEntryText] = useState("");
  const [topTopics, setTopTopics] = useState("");
  const [topMoods, setTopMoods] = useState("");
  const [weatherMood, setWeatherMood] = useState("");
  const [botRecommendation, setBotRecommendation] = useState("");
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
      // Run API calls concurrently and wait for all to complete
      const results = await Promise.all([
        topMoodsAndTopicsWithChatGPT(entryText),
        moodWeatherClassificationWithChatGPT(entryText),
        recommendTherapyChatbotWithChatGPT(entryText),
      ]);
      // Update state with results from API calls
      const [topMoodsAndTopicsResult, moodWeatherClassificationResult, recommendTherapyChatbotResult] = results;
      setTopTopics(topMoodsAndTopicsResult.data.topics);
      setTopMoods(topMoodsAndTopicsResult.data.moods);
      setWeatherMood(moodWeatherClassificationResult.data);
      setBotRecommendation(recommendTherapyChatbotResult.data);

      // Create a new entry in the "entries" collection for the user
      const entriesRef = collection(db, `users/${uid}/entries`);
      await addDoc(entriesRef, {
        entryText: entryText,
        topTopics: topMoodsAndTopicsResult.data.topics,
        topMoods: topMoodsAndTopicsResult.data.moods,
        weatherMood: moodWeatherClassificationResult.data,
        botRecommendation: recommendTherapyChatbotResult.data,
        timeStamp: serverTimestamp(), // Use Firestore's serverTimestamp for consistency
      });
      Alert.alert("Entry Saved", "Your entry has been successfully saved", [
        {
          text: "OK", onPress: () =>
            navigation.navigate('JournalSummary', {
              topTopics: topMoodsAndTopicsResult.data.topics,
              topMoods: topMoodsAndTopicsResult.data.moods,
              weatherMood: moodWeatherClassificationResult.data,
              botRecommendation: recommendTherapyChatbotResult.data,
              entryText: entryText
            })
        }
      ]);
      setEntryText(""); // Clear the input field after successful submission
    } catch (error) {
      console.error("Error submitting entry: ", error);
      Alert.alert("Submission Failed", "Failed to save your entry. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.fullScreenContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require('../assets/journal-background.png')}
          style={styles.fullScreen}
        >
          <Text style={styles.title}>What's on your mind?</Text>
          <Text style={styles.subheaderText}>This is your mind space. Write down anything you wish!</Text>
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
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  title: {
    position: 'absolute',
    top: 80,
    color: "#4A9BB4",
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  subheaderText: {
    position: 'absolute',
    top: 120,
    textAlign: 'center',
    width: '60%',
    color: "#4A9BB4",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    marginBottom: 50, // Adjust the value as needed
  },
  inputSubheader: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  inputHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
  },
  input: {
    marginTop: 220,
    height: '50%',
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    color: "#4A9BB4",
    textAlign: "center",
    marginTop: 36,
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  continueButtonText: {
    color: "#4A9BB4",
    fontWeight: 'bold'
  },
});