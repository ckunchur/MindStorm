import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { journalEntries } from '../data/fakeEntries';
import MoodPieChart from './MoodPieChart';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const options = [
    { label: <Ionicons name="text-outline" size={24} color="white" />, value: "keyboard" },  // use 'keyboard' icon here
    { label: <Ionicons name="mic-outline" size={24} color="white" />, value: "microphone" }  // use 'microphone' icon here
];


const ChipsRow = ({ title, items, onAddItem }) => {
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
                    {/* <TouchableOpacity onPress={onAddItem} style={[styles.chip, styles.addButton]}>
                        <Text style={styles.chipText}>+ Item</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </View>
    );
};

const moods = ['Anxious', 'Overwhelmed', 'Stressed', 'Tired'];
const topics = ['Procrastination', 'Work'];

const handleAddItem = () => console.log('Add item');


const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;


export default function JournalSummary() {


    const navigation = useNavigation();

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
                <WelcomeTitle title="Your Mood Forecast" style={styles.title} />
                <WelcomeMessage message="A summary of the key feelings and topics on your mind now. " style={styles.subheaderText} />
               {/* <MoodPieChart></MoodPieChart> */}
                <View style={styles.controls}>
                    <View style={styles.chipsContainer}>
                        <ChipsRow title="Detected Moods" items={moods} onAddItem={handleAddItem} />
                        <ChipsRow title="Detected Topics" items={topics} onAddItem={handleAddItem} />
                    </View>
                    <View style={styles.predictedTextContainer}>
                    <Text style={styles.predictedText}> Based on your entry, we think {journalEntries[0].suggestedBuddy} would be a good buddy to talk to!
                    </Text>
                    <Image  source={require('../assets/lyra-avatar.png')}></Image>
                    <TouchableOpacity style={styles.chatButton}
                        onPress={() => navigation.navigate('ChatScreen')}
                    >
                        <Text style={[styles.chatButtonText]}>Chat with {journalEntries[0].suggestedBuddy}</Text>
                    </TouchableOpacity>

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
    title: {
        position: 'absolute',
        top: 120,
        color: "#4A9BB4",
        fontSize: 32,
        marginBottom: 16,
        fontWeight: "700",
        fontFamily: "Inter, sans-serif",
    },
    subheaderText: {
        position: 'absolute',
        top: 160,
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
        marginTop: 136
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
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        padding: 16,
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      },
      predictedText: {
        fontFamily: "Inter, sans-serif",
        textAlign: 'center',
        color: '#7887DA',
        fontSize: 16,
      },
    continueButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 99999,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.5,
        height: windowHeight * 0.06,
        position: 'absolute',
        alignItems: 'center',
        alignContent: 'center',
        bottom: 0.12 * windowHeight,

    },
    continueButtonText: {
        fontWeight: 'bold',
        color: '#4A9BB4',
        textAlign: 'center',
    },

    chipsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',

    },
    chipsRowContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        marginTop: 20,
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
        width: windowWidth * 0.4
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

