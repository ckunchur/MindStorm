import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Ionicons } from '@expo/vector-icons';
import { buddies } from '../data/chatSettings';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;


export default function ChooseYourBuddy() {
    const [activeSlide, setActiveSlide] = useState(0);
    const navigation = useNavigation(); // Use the useNavigation hook

    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Image source={item.image} style={styles.buddyImage}></Image>
                    </TouchableOpacity>
                </View>

                <WelcomeMessage message={buddies[activeSlide].speciality} style={styles.subheaderText} />

                <View style={[
                    styles.descriptionBox,
                ]}>
                    <Text style={styles.descriptionText}>{buddies[activeSlide].text}</Text>
                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode="cover"
                source={buddies[activeSlide].background}
                style={styles.fullScreen}
            >
                <WelcomeTitle title="What's your focus?" style={styles.title} />
               

                <Carousel
                    data={buddies}
                    renderItem={renderCarouselItem}
                    onSnapToItem={(index) => setActiveSlide(index)}
                    sliderWidth={300}
                    itemWidth={300}
                    style={styles.carousel}
                />
                <View style={styles.buttonCol}>


                    <TouchableOpacity style={styles.customizeButton}
                        onPress={() => navigation.navigate('ChatScreen')}
                    >
                        <Ionicons name="chatbubbles-outline" size={24} />
                        <Text style={[styles.customizeButtonText]}>Chat with {buddies[activeSlide].name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customizeButton}
                        onPress={() => navigation.navigate('CustomizeScreen', { activeSlide: activeSlide })}

                    >
                        <Ionicons name="hammer-outline" size={24} />
                        <Text style={[styles.customizeButtonText]}>Customize</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullScreen: {
        flex: 1, // Make the background image fill the whole screen
        justifyContent: 'center', // Center the children vertically
        alignItems: 'center', // Center the children horizontally
    },
    title: {
        position: 'absolute',
        top: 80,
        color: "#4A9BB4",
        fontSize: 32,
        marginBottom: 16,
        fontWeight: "700",
    },
    subheaderText: {
        textAlign: 'center',
        color: "white",
        fontSize: 20,
        fontWeight: 'bold',

    },

    bgImage: {
        width: windowWidth,
        height: windowHeight * 1.02,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        paddingTop: 60,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold'
    },
    slide: {marginTop: 160},
    descriptionBox: {
        borderRadius: 32,
        padding: 20,
        margin: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    descriptionText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: '20',
        fontSize: 16
    },

    customizeButtonText: {
        fontWeight: 'bold',
        color: '#4A9BB4',
        textAlign: 'center',
        marginLeft: 8
    },
    customizeButton: {
        backgroundColor: 'white',
        margin: 8,
        padding: 8,
        borderColor: 'white',
        borderRadius: 99999,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.4
    },
    buttonCol: {
        position: 'absolute',
        bottom: 32, // Adjusted to be below status bar
        alignItems: 'center',
        justifyContent: 'center',

    }
});
