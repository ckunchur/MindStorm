import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { buddies } from '../data/optionSettings';
import { weather_moods } from '../data/optionSettings';

const ChipsRow = ({ title, items }) => {
    return (
        <View style={styles.chipsRowContainer}>
            <Text style={styles.chipsHeading}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipsContainer}>
                    {items.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.chip}>
                            <Text style={styles.chipText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default function JournalSummary() {
    const navigation = useNavigation();
    const route = useRoute();
    const { topTopics, topMoods, weatherMood, botRecommendation, entryText } = route.params;
    const MoodImage = ({ mood }) => {
        return (
            <Image
                source={weather_moods[mood]}
                style={mood === weatherMood ? styles.selectedMoodImage : styles.moodImage}
                resizeMode="contain"
            ></Image>
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
                <Text style={styles.title}>Mood Forecast</Text>
                <Text style={styles.subheaderText}>A summary of the key feelings and topics on your mind now.</Text>
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
                <View style={styles.controls}>
                    <View style={styles.chipsContainer}>
                        <ChipsRow title="Detected Moods" items={topMoods} />
                        <ChipsRow title="Detected Topics" items={topTopics} />
                    </View>
                    <View style={styles.predictedTextContainer}>
                        <Text style={styles.predictedText}> Based on your entry, we think {botRecommendation} would be a good buddy to talk to!
                        </Text>
                        <Image source={buddies[botRecommendation == "Lyra" ? 0 : 1].image} style={styles.predictedImage}></Image>
                        <TouchableOpacity style={styles.chatButton}
                            onPress={() => navigation.navigate('ChatScreen', {bot: botRecommendation, entryText: entryText })}
                        >
                            <Text style={[styles.chatButtonText]}>Chat with {botRecommendation}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
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
    moodImage: {
        width: 35,
        marginRight: 8,
        opacity: 0.5
    },
    predictedImage: {
        resizeMode: "contain",
        height: 120
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
        marginBottom: 120,
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
        width: '80%',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',
        justifyContent: 'center'
    },
    chipsRowContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        marginTop: 8,
        justifyContent: 'center'
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

