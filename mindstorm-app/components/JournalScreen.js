import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const options = [
    { label: <Ionicons name="text-outline" size={24} color="white" />, value: "keyboard" },  // use 'keyboard' icon here
    { label: <Ionicons name="mic-outline" size={24} color="white" />, value: "microphone" }  // use 'microphone' icon here
];


export default function JournalScreen() {


    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background-beach.png')}
                style={styles.bgImage}
            >
                <View style={styles.controls}
                >


                    <Text style={styles.heading}>What's troubling you today?</Text>
                    <Text style={styles.subheading}>Speak or type to get your thoughts down!</Text>
                    <SwitchSelector
                        options={options}
                        initial={0}
                        buttonColor={'#4A9BB4'}
                        selectedColor={'white'} // the text color of the selected option
                        backgroundColor={'#1F7D9B'}
                        onPress={value => console.log(`Call function associated with ${value}`)}
                        style={styles.switchSelector}
                    />
                    <Text style={styles.subheading}>February 14, 2024 2:04 PM</Text>

                </View>


                <TextInput
                    style={styles.inputBodyText}
                    placeholder="Type here..."
                    placeholderTextColor="grey"
                    multiline
                />
                <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('JournalSummary')}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>


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
    inputTitleText: {
        fontSize: 24,
        bottom: 0.12 * windowHeight,
    },
    inputBodyText: {
        fontSize: 18,
    }

    ,
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

    switchSelector: {
        width: windowWidth * 0.6,
        height: 40,
        marginBottom: 20,
        // Add more styling as per your design
    },
});

