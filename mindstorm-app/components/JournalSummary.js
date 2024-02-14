import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { journalEntries } from '../data/fakeEntries';

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
                    <TouchableOpacity onPress={onAddItem} style={[styles.chip, styles.addButton]}>
                        <Text style={styles.chipText}>+ Item</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const moods = ['Anxious', 'Overwhelmed'];
const topics = ['Eating', 'Work'];

// Dummy function for demonstration
const handleAddItem = () => console.log('Add item');




export default function JournalSummary() {


    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background-beach.png')}
                style={styles.bgImage}
            >
                <View style={styles.controls}
                >


                    <Text style={styles.heading}>{journalEntries[0].timeStamp}</Text>
                    <Text style={styles.bodyText}>{journalEntries[0].entryText}</Text>
                    <View style={styles.chipsContainer}>
                        <ChipsRow title="Detected Moods" items={moods} onAddItem={handleAddItem} />
                        <ChipsRow title="Detected Topics" items={topics} onAddItem={handleAddItem} />
                    </View>
                    <Text style={styles.predictedText}> Based on your entry, we think {journalEntries[0].suggestedBuddy} would be a good buddy to talk to!
                    </Text>

                </View>
                <View style={styles.buttonRow}>

                
                <TouchableOpacity style={styles.customizeButton}
                   onPress={() => navigation.navigate('ChatScreen')}
                >
                    <Text style={[styles.customizeButtonText]}>Chat with {journalEntries[0].suggestedBuddy}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.customizeButton}
                    onPress={() => navigation.navigate('JournalScreen')}
                >
                    <Text style={[styles.customizeButtonText]}>Exit</Text>
                </TouchableOpacity>
                </View>




            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'blue'
    },
    controls: {
        position: 'absolute',
        top: 0.2 * windowHeight,
        alignItems: 'center',
        justifyContent: 'center',

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

    bodyText: {
        fontSize: 18,
        padding: 16,
        color: 'white',
        backgroundColor: '#4A9BB4',
        opacity: '0.6',
    },
    predictedText: {
        fontSize: 18,
        padding: 16,
        color: 'white',
        backgroundColor: '#4A9BB4',
        opacity: '0.6',
        textAlign: 'center',
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

    customizeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4A9BB4',
        textAlign: 'center',
        marginLeft: 8
    },
    customizeButton: {
       
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

