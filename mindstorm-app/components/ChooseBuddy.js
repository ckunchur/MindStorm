import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ChooseYourBuddy() {
    const [activeSlide, setActiveSlide] = useState(0);

    // Dummy data for the carousel items
    const carouselItems = [
        {

            image: require("../assets/lyra.png"),
            text: "Word vomit, rant - Lyra has you covered. I can work through your chaos and give you a gentle actionable plan to help you feel better ASAP!",
        },
        {
            image: require("../assets/nimbus.png"),

            text: "Stuck in a rut? Need help breaking your tasks into bit-size chunks? Nimbus is here to help!",
        },
        // ... add more buddies as needed
    ];

    // Render Carousel Item
    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.buddyImage}></Image>
                <TouchableOpacity style={styles.chooseButton}>
                    <Text style={styles.freeWriteButtonText}>Choose</Text>
                </TouchableOpacity>
                <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>{carouselItems[activeSlide].text}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background-beach.png')}
                style={styles.bgImage}
            // resizeMode="cover"
            >
                <Text style={styles.heading}>What's troubling you today?</Text>
                <Text style={styles.subheading}>Stress/Anxiety</Text>
                <Carousel
                    data={carouselItems}
                    renderItem={renderCarouselItem}
                    onSnapToItem={(index) => setActiveSlide(index)}
                    sliderWidth={300}
                    itemWidth={300}
                    // layout={'default'}
                    style={styles.carousel}
                />
                <Text style={styles.orText}>OR</Text>
                <TouchableOpacity style={styles.freeWriteButton}>
                    <Text style={styles.freeWriteButtonText}>Free Write</Text>
                </TouchableOpacity>
                <Pagination
                    dotsLength={carouselItems.length}
                    activeDotIndex={activeSlide}
                    containerStyle={styles.paginationContainer}
                    dotStyle={styles.paginationDot}
                    inactiveDotStyle={styles.inactiveDot}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />



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
    buddyImage: {

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
    },
    slide: {

        // Styles for your slide content
    },
    title: {
        textAlign: 'center',
        // Styles for your title
    },
    carousel: {

    },
    paginationContainer: {
    },
    paginationDot: {
        // Styles for active pagination dot
    },
    inactiveDot: {
        // Styles for inactive pagination dot
    },
    descriptionBox: {
        backgroundColor: '#4A9BB4',
        borderRadius: 5,
        padding: 20,
        margin: 16

    },
    descriptionText: {
        color: 'white',
        textAlign: 'center',
    },
    orText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
        paddingBottom: 12,
    },
    chooseButton: {

        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 99999,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.2,
        marginLeft: windowWidth * 0.26,
        marginTop: windowWidth * 0.01,

        height: windowHeight * 0.03,

    },
    freeWriteButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 99999,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.5,
        height: windowHeight * 0.06,

    },
    freeWriteButtonText: {
        fontWeight: 'bold',
        color: '#4A9BB4',
        textAlign: 'center',
    },
});

