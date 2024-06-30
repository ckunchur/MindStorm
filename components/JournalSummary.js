import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { weeklongSummaryWithChatGPT, weeklongTopicClassificationWithChatGPT, weeklongMoodClassificationWithChatGPT } from '../OpenAI/OpenAI';
import { ExtractLastWeekEntriesFirebase } from '../firebase/functions';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useUser } from "../contexts/UserContext";

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
                    ))}                </View>
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
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) {
        return null;
    }

    const route = useRoute();
    const { topTopics, topMoods, weatherMood, botRecommendation, entryText } = route.params;
    const navigation = useNavigation();
    const { userId } = useUser(); // pulled from global state
  
    useEffect(() => {
        performWeeklongAnalysis(userId);
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
                style={mood === weatherMood ? [styles.selectedMoodImage, { tintColor: COLORS.secondarytextcolor }] : [styles.moodImage, { tintColor: COLORS.mindstormLightGrey }]}
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
                <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
            </TouchableOpacity>
            <ImageBackground
                resizeMode="cover"
                source={IMAGES.gradientbg}
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
                    <View
                        style={styles.predictedTextContainer}
                        // onPress={() => navigation.navigate('ChatScreen', { botName: isValidBotRecommendation(botRecommendation) ? botRecommendation : 'Lyra' })}
                    >
                        <Text style={styles.predictedText}>
                            Based on your entry, we think {isValidBotRecommendation(botRecommendation) ? botRecommendation : 'Lyra'} would be a good buddy to talk to!
                        </Text>
                        <Image style={styles.buddyImage} source={botRecommendation === "Lyra" ? require('../assets/lyra.png') : require('../assets/nimbus.png')}></Image>
                       
                        <TouchableOpacity 
                            style={styles.continueButton} 
                            onPress={() => navigation.navigate('ChatScreen', { bot: isValidBotRecommendation(botRecommendation) ? botRecommendation : 'Lyra', entryText: entryText })}
                        >
                            <Text style={styles.continueButtonText}>Chat with {isValidBotRecommendation(botRecommendation) ? botRecommendation : 'Lyra'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: COLORS.mindstormGrey,
    },
    backButton: {
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 10
    },
    moodImage: {
        width: 35,
        marginRight: 8,
        opacity: 0.5,
    },
    selectedMoodImage: {
        width: 48,
        marginRight: 8,
    },
    moodRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '30%',
    },
    buddyImage: {
        width: 140,
        height: 150,
        marginVertical: 20
    },
    noDataText: {
        color: COLORS.mindstormGrey,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        position: 'absolute',
        top: 100,
        color: COLORS.maintextcolor,
        fontSize: 32,
        marginBottom: 16,
        fontFamily: "Inter-Medium",
    },
    forecastView: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 196,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forecasttitle: {
        fontSize: 22,
        fontFamily: "Inter-Medium",
        marginTop: 5,
        marginBottom: 20,
        color: COLORS.maintextcolor,
    },
    subheaderText: {
        position: 'absolute',
        top: 140,
        textAlign: 'center',
        width: '80%',
        color: COLORS.maintextcolor,
        fontSize: 16,
        fontFamily: "Inter-Regular",
        marginTop: 20,
        marginBottom: 120,
    },
    controls: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 260,
    },
    bgImage: {
        width: windowWidth,
        height: windowHeight * 1.02,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontFamily: "Inter-Medium",
        marginBottom: 8,
        color: COLORS.mindstormGrey,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 18,
        color: COLORS.mindstormGrey,
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: "Inter-Medium",
    },
    predictedTextContainer: {
        width: '80%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: COLORS.transcluscentWhite,
        padding: 4,
        textAlign: "center",
        fontFamily: "Inter-Regular",
    },
    predictedText: {
        fontFamily: "Inter-Regular",
        textAlign: 'center',
        color: COLORS.mindstormLightGrey,
        fontSize: 16,
        margin: 20
    },
    chipsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.transcluscentWhite,
    },
    chipsRowContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        marginTop: 8,
    },
    chipsHeading: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        marginBottom: 10,
        marginLeft: 20,
        color: COLORS.mindstormGrey,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
    },
    chip: {
        backgroundColor: COLORS.mindstormTeal,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: COLORS.mindstormTeal,
    },
    chipText: {
        color: COLORS.mindstormGrey,
        textAlign: 'center',
    },
    chatButtonText: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: COLORS.mindstormBlue,
        textAlign: 'center',
        margin: 18,
    },
    chatButton: {
        zIndex: 10,
        backgroundColor: 'white',
        margin: 8,
        padding: 8,
        borderColor: 'white',
        borderRadius: 16,
        width: windowWidth * 0.5,
    },
    buttonRow: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 100,
        right: 12,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: COLORS.mindstormBlue,
        fontWeight: 'bold',
        fontFamily: "Inter-SemiBold",
        paddingVertical: 5,
      },
      continueButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 48,
        borderWidth: 2,
        borderColor: COLORS.mindstormBlue,
        backgroundColor: 'white',
        position: "relative",
        width: "100%",
        maxWidth: windowWidth * 0.8,
        textAlign: "center",
        marginBottom: windowHeight * 0.03,
        padding: windowHeight * 0.02,
        fontSize: windowWidth * 0.04,
        fontWeight: "700",
        fontFamily: "Inter-Medium",
      },
});