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
            <TouchableOpacity
                style={styles.slide}
                onPress={() => navigation.navigate('ChatScreen', { bot: item.name })}
            >
                <View  style={{borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: item.darkColor}}><Text style={styles.title}>{item.speciality}</Text></View>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image resizeMode="contain" source={item.image} style={styles.buddyImage}></Image>
                </View>
                <Text style={[{color: item.darkColor}, styles.subheaderText]}> {item.name}</Text>
                <View style={[styles.descriptionBox]}>
                <Text style={styles.descriptionText}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    

    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode="cover"
                source={IMAGES.gradientbg}
                style={styles.fullScreen}
            >
                
                <View style={styles.carouselContainer}>
                    <Carousel
                        data={buddies}
                        renderItem={renderCarouselItem}
                        onSnapToItem={(index) => setActiveSlide(index)}
                        sliderWidth={windowWidth}
                        itemWidth={windowWidth - 40}
                        contentContainerCustomStyle={styles.carouselContentContainer}
                    />
                </View>
                <View style={styles.buttonCol}>
                    <TouchableOpacity style={{...styles.customizeButton, backgroundColor: buddies[activeSlide].darkColor}}
                        onPress={() => navigation.navigate('ChatScreen', { bot: buddies[activeSlide].name})}
                    >
                        <Ionicons name="chatbubbles-outline" size={24} style={{color: "white"}} />
                        <Text style={{ ...styles.customizeButtonText,  color: buddies[activeSlide].lightColor }}>Chat with {buddies[activeSlide].name}</Text>
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
    carouselContainer:{
        flex: 1,
        marginTop:80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContentContainer: {
        paddingHorizontal: 20,
    },
    title: {
        color: 'white',
        fontSize: 28,
        marginBottom: 8,
        padding: 16,
        textAlign: 'center',
        fontFamily: "Inter-Semibold"
    },
    subheaderText: {
        textAlign: 'center',
        fontSize: 25,
        fontFamily: "Inter-Medium"   
    },
    buddyImage:{
        width: 0.55 * windowWidth,
        height:  0.55 * windowWidth,
        marginBottom: 20,
        marginTop: 12
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
        fontFamily: 'Inter-Regular',
        marginBottom: 12,
        color: COLORS.mindstormPurple,
        paddingTop: 160,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: "Inter-Regular"
    },
    slide: { 
        backgroundColor: COLORS.transcluscentWhite,
        borderRadius: 30,
        // padding: 20,
        marginHorizontal: 10,
    },
    descriptionBox: {
        borderRadius: 32,
        padding: 20,
        margin: 16,
        backgroundColor: 'white'
    },
    descriptionText: {
        color: COLORS.mindstormGrey,
        textAlign: 'center',
        marginBottom: '20',
        fontSize: 16
    },
    customizeButtonText: {
        fontWeight: 'bold',
        color: "white",
        textAlign: 'center',
        marginLeft: 4,
        fontFamily: "Inter-Regular"
    },
    customizeButton: {
        backgroundColor: COLORS.mindstormLightPurple,
        margin: 8,
        padding: 12,
        paddingLeft: 22,
        paddingRight: 22,
        borderColor: COLORS.mindstormLightPurple,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.6
    },
    buttonCol: {
        position: 'absolute',
        bottom: 32, 
        alignItems: 'center',
        justifyContent: 'center',
    }
});