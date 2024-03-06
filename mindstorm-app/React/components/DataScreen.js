import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { journalEntries } from '../data/fakeEntries';
import DonutChart from './DonutChart';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { ExtractUserNameFromFirebase, ExtractLastWeekEntriesFirebase} from '../firebase/functions';
import { weeklongTopicClassificationWithChatGPT, weeklongSummaryWithChatGPT} from '../OpenAI/OpenAI';
const colors = ['#1a75ad', '#a47dff', '#335c9e', 'skyblue', '#ffb6c1'];

const ChartRow = ({ title, sections }) => {
    return (
      <View style={styles.chartRowContainer}>
        <DonutChart
          size={160}
          strokeWidth={25}
          sections={sections.map((item, index) => ({
            ...item,
            color: colors[index % colors.length],
          }))}
        />
  
        <ScrollView vertical showsHorizontalScrollIndicator={false}>
          <Text style={styles.chipsHeading}>{title}</Text>
          <View style={styles.chipsContainer}>
            {sections.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.chip, { backgroundColor: colors[index % colors.length] }]}
              >
                <Text style={styles.chipText}>{item.label} ({item.percentage}%)</Text>
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
    "Cloudy": require("../assets/cloudy-mood.png"),
    "Sunny": require("../assets/sunny-mood.png"),
}

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function DataScreen() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [entries, setEntries] = useState([]); // Step 1: State for entries
    const [weeklongSummary, setweeklongSummary] = useState("");
    const [weeklongTopics, setweeklongTopics] = useState([]);

    useEffect(() => {
        const userId = "imIQfhTxJteweMhIh88zvRxq5NH2"; // hardcoded for now

        const fetchData = async () => {
            console.log("Fetching data for user ID:", userId);
            
            // Fetch user name
            const fetchedUserName = await ExtractUserNameFromFirebase(userId);
            if (fetchedUserName) {
                setUserName(fetchedUserName);
                console.log("User's name:", fetchedUserName);
            } else {
                console.log("UserName not found or error fetching userName");
            }
            // do analysis
            const fetchedEntries = await ExtractLastWeekEntriesFirebase(userId);
            if (fetchedEntries.length > 0) {
                setEntries(fetchedEntries);
                console.log("Fetched entries:", fetchedEntries);
                console.log("Attempting mood classification...");
                // Run API calls concurrently and wait for all to complete
                try {
                    const results = await Promise.all([
                        weeklongSummaryWithChatGPT(JSON.stringify(fetchedEntries)),
                        weeklongTopicClassificationWithChatGPT(JSON.stringify(fetchedEntries)),
                    ]);
                    console.log("Results from mood classification:", results);
                    const [weeklongSummaryWithResult, weeklongTopicClassificationResult] = results;
                    setweeklongSummary(weeklongSummaryWithResult.data);
    
                    // Extract the JSON string from the response
                    const jsonString = weeklongTopicClassificationResult.data.match(/```json\s*([\s\S]*?)\s*```/)[1];
    
                    // Replace escaped double quotes with regular quotes
                    const sanitizedJsonString = jsonString.replace(/\\"/g, '"');
    
                    try {
                        const parsedData = JSON.parse(sanitizedJsonString);
                        setweeklongTopics(parsedData);
                    } catch (error) {
                        console.error("Error parsing weeklongTopicClassificationResult:", error);
                        // Handle the parsing error, show an error message, or take appropriate action
                    }
                } catch (error) {
                    console.error('Error during mood classification:', error);
                    // Handle the error, show an error message, or take appropriate action
                }
            } else {
                console.log("No entries found or error fetching entries");
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures this effect runs only once when the component mounts

    const MoodImage = ({ mood, date }) => {
        return (
            <View style={styles.moodWeatherView}>
                <Image
                    source={weather_moods[mood]}
                    style={styles.moodImage}
                    resizeMode="contain"
                ></Image>
                <Text style={styles.moodWeatherText}>{date}</Text>
            </View>
        )
    }

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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <WelcomeTitle title={userName ? `Hi ${userName},` : "Emotional Report"} style={styles.title} />
                    <WelcomeMessage message="Here is a summary of your key feelings and topics over time" style={styles.subheaderText} />
                    <Text style={styles.summarySubheading}>Your weather moods this week:</Text>
                    <View style={styles.forecastView}>
                        <View style={styles.moodRow}>
                            <MoodImage mood="Stormy" date="Today"></MoodImage>
                            <MoodImage mood="Rainy" date="03/02"></MoodImage>
                            <MoodImage mood="Cloudy" date="03/01"></MoodImage>
                            <MoodImage mood="Partly Cloudy" date="02/29"></MoodImage>
                            <MoodImage mood="Sunny" date="02/28"></MoodImage>
                        </View>
                    </View>
                    {weeklongTopics.length > 0 && (
                        <View style={styles.donutChartContainer}>
                            <ChartRow title="Weekly Topics" sections={weeklongTopics} />
                        </View>
                        )}
                    <Text style={styles.summarySubheading}>Here is a summary of your week:</Text>
                    <View style={styles.controls}>
                        {weeklongSummary && (
                            <View style={styles.predictedTextContainer}>
                                <Text style={styles.predictedText}>{weeklongSummary}</Text>
                            </View>
                        )}

                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1, // Make the container fill the whole screen
    },
    fullScreen: {
        flex: 1, // Make the background image fill the whole screen
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 40,
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
        top: 60,
        left: 20,
        zIndex: 10,
    },
    moodWeatherView: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        margin: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 12,
    },
    moodImage: {
        width: 48,
        opacity: 0.5,
        marginBottom: 8,
    },
    moodWeatherText: {
        color: 'white',
        fontWeight: 'bold',
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    title: {
        color: "#4A9BB4",
        fontSize: 32,
        marginBottom: 16,
        fontWeight: "700",
        fontFamily: "Inter, sans-serif",
        textAlign: 'center',
    },
    forecastView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    forecasttitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    subheaderText: {
        textAlign: 'center',
        width: '80%',
        color: "#4A9BB4",
        fontSize: 16,
        fontFamily: "Inter, sans-serif",
        marginBottom: 20,
    },
    controls: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        width: '100%',
    },
    summarySubheading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A9BB4',
        textAlign: 'center',
      },
    predictedTextContainer: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        padding: 16,
        marginBottom: 20,
    },
    predictedText: {
        fontFamily: "Inter, sans-serif",
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
    },
    donutChartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    chartRowContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        padding: 4,
        borderRadius: 16,
        marginTop: 8,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'row'
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
    chipText: {
        color: 'white',
        textAlign: 'center',
    },
});