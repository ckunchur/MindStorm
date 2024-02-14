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
import {buddies} from '../data/buddies';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ChooseYourBuddy() {
    const [activeSlide, setActiveSlide] = useState(0);
    const navigation = useNavigation(); // Use the useNavigation hook

    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                        <Image source={item.image} style={styles.buddyImage}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customizeButton} 
                    onPress={() => navigation.navigate('CustomizeScreen', { activeSlide: activeSlide })}

                    >
                        <Ionicons name="hammer-outline" size={24} />
                        <Text style={[styles.customizeButtonText]}>Customize {buddies[activeSlide].name}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[
                    styles.descriptionBox,
                    { backgroundColor: buddies[activeSlide].lightColor }
                ]}>
                    <Text style={styles.descriptionText}>{buddies[activeSlide].text}</Text>
                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={buddies[activeSlide].background}
                style={styles.bgImage}
            >
                <Text style={styles.heading}>What's troubling you today?</Text>
                <Text style={styles.subheading}>{buddies[activeSlide].speciality}</Text>
                <Carousel
                    data={buddies}
                    renderItem={renderCarouselItem}
                    onSnapToItem={(index) => setActiveSlide(index)}
                    sliderWidth={300}
                    itemWidth={300}
                    style={styles.carousel}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'blue',
    },
    buddyImage: {},
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
    slide: {},
    carousel: {},
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
        width: windowWidth * 0.5
    },
});
