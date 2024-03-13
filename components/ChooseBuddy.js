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
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import { buddies } from '../data/optionSettings';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES} from '../styles/globalStyles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChooseYourBuddy() {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) {
      return null;
    }    
    
    const [activeSlide, setActiveSlide] = useState(0);
    const navigation = useNavigation(); 


    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Image source={item.image} style={styles.buddyImage}></Image>
                    </TouchableOpacity>
                </View>
                <Text style={styles.subheaderText}>{buddies[activeSlide].name}</Text>
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
                // source={buddies[activeSlide].chooseBackground}
                source={IMAGES.gradientbg}
                style={styles.fullScreen}
            >
                <Text style={styles.title}> {buddies[activeSlide].speciality}</Text>
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
                        onPress={() => navigation.navigate('ChatScreen', { bot: buddies[activeSlide].name})}
                    >
                        <Ionicons name="chatbubbles-outline" size={24} />
                        <Text style={{ ...styles.customizeButtonText, color: buddies[activeSlide].lightColor }}>Chat with {buddies[activeSlide].name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.customizeButton}
                        onPress={() => navigation.navigate('CustomizeScreen', { activeSlide: activeSlide })}
                    >
                        <Ionicons name="hammer-outline" size={24} />
                        <Text style={{ ...styles.customizeButtonText, color: buddies[activeSlide].lightColor }}>
                            Customize</Text>
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
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    title: {
        position: 'absolute',
        top: 80,
        color: COLORS.mindstormGrey,
        fontSize: 32,
        marginBottom: 16,
        fontWeight: "700",
    },
    subheaderText: {
        textAlign: 'center',
        color: COLORS.mindstormPurple,
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
        fontFamily: 'Inter-SemiBold',
        marginBottom: 8,
        color: COLORS.mindstormPurple,
        paddingTop: 60,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 18,
        color:COLORS.mindstormPurple,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold'
    },
    slide: { marginTop: 160 },
    descriptionBox: {
        borderRadius: 32,
        padding: 20,
        margin: 16,
        backgroundColor: COLORS.transcluscentWhite,
    },
    descriptionText: {
        color: COLORS.mindstormGrey,
        textAlign: 'center',
        marginBottom: '20',
        fontSize: 16
    },
    customizeButtonText: {
        fontWeight: 'bold',
        color: COLORS.mindstormGrey,
        textAlign: 'center',
        marginLeft: 4
    },
    customizeButton: {
        backgroundColor: 'white',
        margin: 8,
        padding: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderColor: 'white',
        borderRadius: 16,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.4
    },
    buttonCol: {
        position: 'absolute',
        bottom: 32, 
        alignItems: 'center',
        justifyContent: 'center',
    }
});
