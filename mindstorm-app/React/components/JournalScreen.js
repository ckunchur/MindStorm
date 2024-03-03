import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { topMoodsAndTopicsWithChatGPT, moodWeatherClassificationWithChatGPT, recommendTherapyChatbotWithChatGPT } from '../OpenAI/OpenAI';

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function JournalScreen() {
  const navigation = useNavigation();
  const [entryText, setEntryText] = useState("");
  const [topTopics, setTopTopics] = useState("");
  const [topMoods, setTopMoods] = useState("");
  const [weatherMood, setWeatherMood] = useState("");
  const [botRecommendation, setBotRecommendation] = useState("");


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
      // Run API calls concurrently and wait for all to complete
      const results = await Promise.all([
        topMoodsAndTopicsWithChatGPT(entryText),
        moodWeatherClassificationWithChatGPT(entryText),
        recommendTherapyChatbotWithChatGPT(entryText),
      ]);

      // // Update state with results from API calls
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
            })
        }
      ]);
      // Alert.alert("Entry Saved", "Your entry has been successfully saved", [
      //   { text: "OK", onPress: () => navigation.navigate('JournalSummary') }
      // ]);



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
        source={require('../assets/journal-background.png')}
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