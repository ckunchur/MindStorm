import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { journalEntries } from '../data/fakeEntries';
import MoodPieChart from './DonutChart';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { weeklongSummaryWithChatGPT, weeklongTopicClassificationWithChatGPT, weeklongMoodClassificationWithChatGPT } from '../OpenAI/OpenAI';
import { ExtractLastWeekEntriesFirebase } from '../firebase/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChipsRow = ({ title, items }) => {
    return (
        <View style={styles.chipsRowContainer}>
            <Text style={styles.chipsHeading}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipsContainer}>
                    {items && items.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.chip}>
                            <Text style={styles.chipText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const weather_moods = {
    "Stormy": require("../assets/stormy-mood.png"),
    "Rainy": require("../assets/rainy-mood.png"),
    "Cloudy": require("../assets/cloudy-mood.png"),
    "Partly Cloudy": require("../assets/partial-cloudy-mood.png"),
    "Sunny": require("../assets/sunny-mood.png"),
};

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function JournalSummary() {
  const route = useRoute();
  const { topTopics, topMoods, weatherMood, botRecommendation } = route.params;
  const navigation = useNavigation();
  const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now

  useEffect(() => {
    performWeeklongAnalysis(testUser);
  }, []);

  const performWeeklongAnalysis = async (uid) => {
    const fetchedEntries = await ExtractLastWeekEntriesFirebase(uid);
    if (fetchedEntries.length > 0) {
      try {
        const results = await Promise.all([
          weeklongSummaryWithChatGPT(JSON.stringify(fetchedEntries)),
          weeklongTopicClassificationWithChatGPT(JSON.stringify(fetchedEntries)),
          weeklongMoodClassificationWithChatGPT(JSON.stringify(fetchedEntries)),
        ]);
        const [
          weeklongSummaryWithResult,
          weeklongTopicClassificationResult,
          weeklongMoodClassificationResult,
        ] = results;

        console.log("Weeklong Summary Result:", weeklongSummaryWithResult);
        console.log("Weeklong Topic Classification Result:", weeklongTopicClassificationResult);
        console.log("Weeklong Mood Classification Result:", weeklongMoodClassificationResult);

        // Extract the JSON string from the topic classification response
        const topicJsonString = weeklongTopicClassificationResult.data.match(/```json\s*([\s\S]*?)\s*```/)?.[1];
        const parsedTopicData = topicJsonString ? JSON.parse(topicJsonString.replace(/\\"/g, '"')) : [];

        // Extract the JSON string from the mood classification response
        const moodJsonString = weeklongMoodClassificationResult.data.match(/```json\s*([\s\S]*?)\s*```/)?.[1];
        const parsedMoodData = moodJsonString ? JSON.parse(moodJsonString.replace(/\\"/g, '"')) : [];

        // Firebase: Create a new entry in the "weeklyAnalysis" collection for the user
        const weeklyAnalysisRef = collection(db, `users/${uid}/weeklyAnalysis`);
        console.log("Weeklong Summary Data:", weeklongSummaryWithResult.data);
        await addDoc(weeklyAnalysisRef, {
          weeklongSummary: weeklongSummaryWithResult.data || "",
          weeklongTopics: parsedTopicData,
          weeklongMoods: parsedMoodData,
          timeStamp: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error during weekly analysis:', error);
        // Handle the error, show an error message, or take appropriate action
      }
    }
  };

    const MoodImage = ({ mood }) => {
        return (
            <Image
                source={weather_moods[mood]}
                style={mood === weatherMood ? styles.selectedMoodImage : styles.moodImage}
                resizeMode="contain"
            ></Image>
        );
    };

    const isValidWeatherMood = (mood) => {
        const validMoods = ["Stormy", "Rainy", "Cloudy", "Partly Cloudy", "Sunny"];
        return validMoods.includes(mood);
    };

    const isValidBotRecommendation = (botName) => {
        const validBots = ["Lyra", "Nimbus"];
        return validBots.includes(botName);
    };

    return (
        <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color="#4A9BB4" size={48} />
            </TouchableOpacity>
            <ImageBackground
                resizeMode="cover"
                source={require('../assets/journal-background.png')}
                style={styles.fullScreen}
            >
                <WelcomeTitle title="Mood Forecast" style={styles.title} />
                <WelcomeMessage message="A summary of the key feelings and topics on your mind now. " style={styles.subheaderText} />

                {isValidWeatherMood(weatherMood) && (
                    <View style={styles.forecastView}>
                        <Text style={styles.forecasttitle}>Feeling: {weatherMood}</Text>
                        <View style={styles.moodRow}>
                            <MoodImage mood="Stormy"></MoodImage>
                            <MoodImage mood="Rainy"></MoodImage>
                            <MoodImage mood="Cloudy"></MoodImage>
                            <MoodImage mood="Partly Cloudy"></MoodImage>
                            <MoodImage mood="Sunny"></MoodImage>
                        </View>
                    </View>
                )}

                <View style={styles.controls}>
                    <View style={styles.chipsContainer}>
                        {Array.isArray(topMoods) && topMoods.length > 0 ? (
                            <ChipsRow title="Detected Moods" items={topMoods} />
                        ) : (
                            <Text style={styles.noDataText}></Text>
                        )}
                        {Array.isArray(topTopics) && topTopics.length > 0 && (
                            <ChipsRow title="Detected Topics" items={topTopics} />
                        )}
                    </View>
                    {!isValidBotRecommendation(botRecommendation) && (
                        <View style={styles.predictedTextContainer}>
                            <Text style={styles.predictedText}>
                                Based on your entry, we think Lyra would be a good buddy to talk to!
                            </Text>
                            <Image source={require('../assets/lyra.png')}></Image>
                            <TouchableOpacity
                                style={styles.chatButton}
                                onPress={() => navigation.navigate('ChatScreen')}
                            >
                                <Text style={[styles.chatButtonText]}>Chat with Lyra</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {isValidBotRecommendation(botRecommendation) && (
                        <View style={styles.predictedTextContainer}>
                            <Text style={styles.predictedText}>
                                Based on your entry, we think {botRecommendation} would be a good buddy to talk to!
                            </Text>
                            <Image source={require('../assets/lyra.png')}></Image>
                            <TouchableOpacity
                                style={styles.chatButton}
                                onPress={() => navigation.navigate('ChatScreen')}
                            >
                                <Text style={[styles.chatButtonText]}>Chat with {botRecommendation}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ImageBackground>
        </View>
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'blue'
    },
    backButton: {
        position: 'absolute',
        top: 80, // Adjusted to be below status bar
        left: 20,
        zIndex: 10, // Ensure the back button is above the chat bubbles
    },
    moodImage:{
        width: 35,
        marginRight: 8,
        opacity: 0.5
    },
    selectedMoodImage:{
        width: 48,
        marginRight: 8,
        },
    moodRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '30%',
    },
    noDataText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        position: 'absolute',
        top: 100,
        color: "#4A9BB4",
        fontSize: 32,
        marginBottom: 16,
        fontWeight: "700",
        fontFamily: "Inter, sans-serif",
    },
    forecastView: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 196,
        padding: '8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    forecasttitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    subheaderText: {
        position: 'absolute',
        top: 140,
        textAlign: 'center',
        width: '80%',
        color: "#4A9BB4",
        fontSize: 16,
        fontFamily: "Inter, sans-serif",
        marginBottom: 120, // Adjust the value as needed
    },
    controls: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 260
    },
    bgImage: {
        width: windowWidth,
        height: windowHeight * 1.02,
        alignItems: 'center',
        justifyContent: 'center',

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        textAlign: 'center',
    },
    subheading: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },

    predictedTextContainer: {
        width: '80%', // Adjust the width as needed
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        padding: 8,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
    },
    predictedText: {
        fontFamily: "Inter, sans-serif",
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
    },
  
    chipsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',

    },
    chipsRowContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        marginTop: 8,
    },
    chipsHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 20,
        color: 'white',

    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,

    },
    chip: {
        backgroundColor: '#1F7D9B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#4A9BB4',
    },
    chipText: {
        color: 'white',
        textAlign: 'center',
    },

    chatButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#7887DA',
        textAlign: 'center',
        marginLeft: 8
    },
    chatButton: {

        zIndex: 10,
        backgroundColor: 'white',
        margin: 8,
        padding: 8,
        borderColor: 'white',
        borderRadius: 99999,
        width: windowWidth * 0.5
    },
    buttonRow: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 100, // Adjusted to be below status bar
        right: 12,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',

    }
});