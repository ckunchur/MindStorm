import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { journalEntries } from '../data/fakeEntries';
import DonutChart from './DonutChart';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const colors = ['#1a75ad', '#a47dff', '#335c9e', 'skyblue'];
const ChartRow = ({ title, items }) => {
    return (
        <View style={styles.chartRowContainer}>
           
            <DonutChart
                size={160}
                strokeWidth={25}
                sections={[
                    { percentage: 25, color: colors[0] },
                    { percentage: 15, color: colors[1] },
                    { percentage: 35, color: colors[2]},
                    { percentage: 25, color: colors[3] },
                ]}
            />
            <ScrollView vertical showsHorizontalScrollIndicator={false}>
            <Text style={styles.chipsHeading}>{title}</Text>
                <View style={styles.chipsContainer}>
                    {items.map((item, index) => (
                        <TouchableOpacity key={index} 
                        style={[
                            styles.chip,
                            { backgroundColor: colors[index] }
                          ]}>
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
    "Cloudy": require("../assets/cloudy-mood.png"),
    "Sunny": require("../assets/sunny-mood.png"),
}


const topMoods = ["Anxious", "Stressed"];
const topTopics = ["School", "Work", "Procrastination"];
const weatherMood = "Anxious";
const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;


export default function DataScreen() {
    const navigation = useNavigation();
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
                <WelcomeTitle title="Emotional Report" style={styles.title} />
                <WelcomeMessage message="A summary of your key feelings and topics over time" style={styles.subheaderText} />

                <View style={styles.forecastView}>
                    <View style={styles.moodRow}>
                        <MoodImage mood="Stormy" date="Today"></MoodImage>
                        <MoodImage mood="Rainy" date="03/02"></MoodImage>
                        <MoodImage mood="Cloudy" date="03/01"></MoodImage>
                        <MoodImage mood="Partly Cloudy" date="02/29"></MoodImage>
                        <MoodImage mood="Sunny" date="02/28"></MoodImage>

                    </View>
                </View>

                <View style={styles.controls}>

                    <View style={styles.chipsContainer}>
                        <ChartRow title="Top Moods" items={topMoods} />
                        <ChartRow title="Top Topics" items={topTopics} />
                    </View>


                </View>


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
    moodWeatherView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        margin: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)"',
        borderRadius: 12,
        marginTop: 20

    },
    moodImage: {
        width: 48,
        opacity: 0.5,
        marginTop: 36
    },
    moodWeatherText: {
        color: 'white',
        paddingBottom: 16,
        fontWeight: 'bold'

    },


    moodRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '30%',
    },

    title: {
        position: 'absolute',
        top: 110,
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
        top: 148,
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

