import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DonutChart from './DonutChart';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { ExtractUserNameFromFirebase, ExtractLatestWeeklyAnalysisFromFirebase } from '../firebase/functions';

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
    const [weeklongSummary, setWeeklongSummary] = useState("");
    const [weeklongTopics, setWeeklongTopics] = useState([]);
    const [weeklongMoods, setWeeklongMoods] = useState([]);

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

            // Fetch latest weekly analysis
            console.log("Fetching latest weekly analysis...");
            const fetchedWeeklyAnalysis = await ExtractLatestWeeklyAnalysisFromFirebase(userId);
            if (fetchedWeeklyAnalysis) {
                console.log("Fetched weekly analysis:", fetchedWeeklyAnalysis);
                setWeeklongSummary(fetchedWeeklyAnalysis.weeklongSummary || "");
                setWeeklongTopics(fetchedWeeklyAnalysis.weeklongTopics || []);
                setWeeklongMoods(fetchedWeeklyAnalysis.weeklongMoods || []);
                console.log(weeklongMoods)
            } else {
                console.log("No weekly analysis found or error fetching weekly analysis");
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
            source={require('../assets/chat-lyra-background.png')}
            style={styles.fullScreen}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <WelcomeTitle title={userName ? `Hi ${userName},` : "Your weekly summary"} style={styles.title} />
              <WelcomeMessage message="Here is a summary of your key feelings and topics over time" style={styles.subheaderText} />

              {/* Daily weather moods */}
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

              {/* Weeklong topics */}
              {weeklongTopics.length > 0 ? (
                <>
                  <Text style={styles.summarySubheading}>Your brain real estate this week:</Text>
                  <View style={styles.donutChartContainer}>
                    <ChartRow title="" sections={weeklongTopics} />
                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>No weekly topic data available.</Text>
              )}
      
              {/* Weeklong moods */}
              {weeklongTopics.length > 0 ? (
                <>
                  <Text style={styles.summarySubheading}>Your overall moods week:</Text>
                  <View style={styles.donutChartContainer}>
                    <ChartRow title="" sections={weeklongMoods} />
                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>No weekly topic data available.</Text>
              )}
      
              {/* Weeklong summary */}
              {weeklongSummary ? (
                <>
                  <Text style={styles.summarySubheading}>Here is a summary of your week:</Text>
                  <View style={styles.controls}>
                    <View style={styles.predictedTextContainer}>
                      <Text style={styles.predictedText}>{weeklongSummary}</Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>No weekly summary available.</Text>
              )}
      
            </ScrollView>
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
        marginTop: 30,
    },
    title: {
        color: "white",
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
        color: "white",
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
        color: 'white',
        textAlign: 'left',
        marginTop: 20,
        marginBottom:-30
      },
    predictedTextContainer: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        // backgroundColor: "rgba(255, 255, 255, 0.4)",
        padding: 10,
        marginBottom: 20,
    },
    predictedText: {
        fontFamily: "Inter, sans-serif",
        textAlign: 'left',
        color: 'white',
        fontSize: 16,
    },
    donutChartContainer: {
        alignItems: 'right',
        justifyContent: 'center',
        marginTop: 20,
    },
    chartRowContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 4,
        marginLeft: 30,
        borderRadius: 16,
        // backgroundColor: 'rgba(0, 255, 255, 0.2)',
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