import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { buddies, toneOptions, genderOptions, ageOptions, memoryOptions } from '../data/chatSettings';
import { writeBotSettingsToFirebase } from '../firebase/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const userId = "2Plv4ZA1wvY4pdkQyicn";



export default function CustomizeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [activeSlide, setActiveSlide] = useState(route.params?.activeSlide || 0);
    const [memoryOption, setMemoryOption] = useState('forget');
    const [toneOption, setToneOption] = useState('therapist');
    const [ageOption, setAgeOption] = useState('adult');
    const [genderOption, setGenderOption] = useState('female');

    const handleSaveSettings = async () => {
        const bot = buddies[activeSlide].id;
        await writeBotSettingsToFirebase(userId, bot, memoryOption, toneOption, ageOption, genderOption);
        console.log("Settings saved successfully.");
    };



    return (
        <View style={styles.container}>
            <ImageBackground
                source={buddies[activeSlide].background}
                style={styles.bgImage}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
                </TouchableOpacity>
                <Text style={styles.heading}>Customize {buddies[activeSlide].name}</Text>

                <View style={styles.slide}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image source={buddies[activeSlide].imageNoBackground} style={styles.buddyImage}></Image>
                    </View>
                </View>
                <View style={styles.switchGroup}>
                    <Text style={styles.switchHeading}>Conversation Memory</Text>

                    <SwitchSelector
                        options={memoryOptions}
                        initial={0}
                        buttonColor={buddies[activeSlide].lightColor}
                        textColor={'#DAE2EB'}
                        selectedColor={'white'} // the text color of the selected option
                        backgroundColor={buddies[activeSlide].darkColor}
                        onPress={value => setMemoryOption(value)}
                        style={styles.switchSelector}
                    />
                    <Text style={styles.switchHeading}>Adjust Tone</Text>
                    <SwitchSelector
                        options={toneOptions}
                        initial={0}
                        buttonColor={buddies[activeSlide].lightColor}
                        textColor={'#DAE2EB'}
                        selectedColor={'white'} // the text color of the selected option
                        backgroundColor={buddies[activeSlide].darkColor}
                        onPress={value => setToneOption(value)}
                        style={styles.switchSelector}
                    />
                    <Text style={styles.switchHeading}>Adjust Gender</Text>
                    <SwitchSelector
                        options={genderOptions}
                        initial={0}
                        textColor={'#DAE2EB'}
                        buttonColor={buddies[activeSlide].lightColor}
                        selectedColor={'white'} // the text color of the selected option
                        backgroundColor={buddies[activeSlide].darkColor}
                        onPress={value => setGenderOption(value)}
                        style={styles.switchSelector}
                    />
                    <Text style={styles.switchHeading}>Adjust Age</Text>
                    <SwitchSelector
                        options={ageOptions}
                        initial={0}
                        buttonColor={buddies[activeSlide].lightColor}
                        textColor={'#DAE2EB'}
                        selectedColor={'white'} // the text color of the selected option
                        backgroundColor={buddies[activeSlide].darkColor}
                        onPress={value => setAgeOption(value)}
                        style={styles.switchSelector}
                    />
                </View>
                <TouchableOpacity style={styles.customizeButton}
                    onPress={handleSaveSettings}
                >
                    <Ionicons name="save-outline" size={24} />
                    <Text style={[styles.customizeButtonText]}>Save</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'blue',
    },
    switchSelector: {
        width: windowWidth * 0.6,
        height: 40,
    },
    switchGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
        justifyContent: 'center',
    },
    switchButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 100, 
        left: 20,
        zIndex: 10, 
    },
    backButtonText: {
        fontWeight: 'bold',
        color: '#4A9BB4',
        textAlign: 'center',
    },
    buddyImage: {},
    bgImage: {
        width: windowWidth,
        height: windowHeight * 1.02,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    slide: {
        width: 300,

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 6,
        color: 'white',
        textAlign: 'center',

    },
    switchHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 6,
        color: 'white',
        textAlign: 'center',

    },
    subheading: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    descriptionBox: {
        borderRadius: 5,
        padding: 20,
        margin: 16,
    },
    descriptionText: {
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
        position: 'absolute',
        top: 100, // Adjusted to be below status bar
        right: 12,
        zIndex: 10,
        backgroundColor: 'white',
        margin: 8,
        padding: 8,
        borderColor: 'white',
        borderRadius: 99999,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.25
    },
});
