import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChooseYourBuddy() {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation(); // Use the useNavigation hook

  const carouselItems = [
    {
      image: require("../assets/lyra.png"),
      background: require('../assets/background-beach.png'),
      backgroundColor: '#4A9BB4',
      text: "Word vomit, rant - Lyra has you covered. I can work through your chaos and give you a gentle actionable plan to help you feel better ASAP!",
    },
    {
      image: require("../assets/nimbus.png"),
      background: require('../assets/background-desert.png'),
      backgroundColor: '#FF8D94',
      text: "Stuck in a rut? Need help breaking your tasks into bit-size chunks? Nimbus is here to help!",
    },
    // ... add more buddies as needed
  ];

  const renderCarouselItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
          <Image source={item.image} style={styles.buddyImage}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chooseButton}>
          <Text style={styles.freeWriteButtonText}>Choose</Text>
        </TouchableOpacity>
        <View style={[
          styles.descriptionBox,
          { backgroundColor: carouselItems[activeSlide].backgroundColor }
        ]}>
          <Text style={styles.descriptionText}>{carouselItems[activeSlide].text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={carouselItems[activeSlide].background}
        style={styles.bgImage}
      >
        <Text style={styles.heading}>What's troubling you today?</Text>
        <Text style={styles.subheading}>Stress/Anxiety</Text>
        <Carousel
          data={carouselItems}
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
  freeWriteButtonText: {
    fontWeight: 'bold',
    color: '#4A9BB4',
    textAlign: 'center',
  },
});
