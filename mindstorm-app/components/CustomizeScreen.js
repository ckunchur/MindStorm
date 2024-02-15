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
import { RadioButton } from 'react-native-paper'; // Assuming you're using react-native-paper for Radio Buttons

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation
import { Ionicons } from '@expo/vector-icons';
import { buddies } from '../data/buddies';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function CustomizeScreen() {
    const navigation = useNavigation(); // Use the useNavigation hook
    const route = useRoute(); // Import useRoute from '@react-navigation/native'
    const [activeSlide, setActiveSlide] = useState(route.params?.activeSlide || 0);
    const [memoryOption, setMemoryOption] = useState('forget'); // State for radio button selection
    
    const toneOptions = [
        { label: "Therapist", value: "strict" },
        { label: "Best Friend", value: "comforting" },
        { label: "Mentor", value: "logical" }
    ];
    const genderOptions = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
    ];
    const ageOptions = [
        { label: "Teenager", value: "teen" },
        { label: "Young Adult", value: "young" },
        { label: "Adult", value: "young" },
    ];
    const memoryOptions = [
        { label: "Forget", value: "forget" },
        { label: "Remember", value: "remember" },
    ];

    console.log(activeSlide);



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
                    onPress={value => console.log(`Call function associated with ${value}`)}
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
                    onPress={value => console.log(`Call function associated with ${value}`)}
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
                        onPress={value => console.log(`Call function associated with ${value}`)}
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
                        onPress={value => console.log(`Call function associated with ${value}`)}
                        style={styles.switchSelector}
                    />
                </View>
                <TouchableOpacity style={styles.customizeButton}
                    onPress={() => navigation.navigate('CustomizeScreen', { activeSlide: activeSlide })}

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
        // Style for the text inside each switch button
        color: 'white',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 100, // Adjusted to be below status bar
        left: 20,
        zIndex: 10, // Ensure the back button is above the chat bubbles
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
