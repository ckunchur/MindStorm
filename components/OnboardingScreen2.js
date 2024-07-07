import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Chip, Button } from 'react-native-paper';
import { IMAGES, COLORS } from '../styles/globalStyles'; // Adjust the path as necessary
import { Ionicons } from '@expo/vector-icons';

const OnboardingScreen2 = ({ navigation }) => {
  const [selectedChips, setSelectedChips] = useState([]);
  console.log('selectedChips:', selectedChips);
  const options = [
    "Be Happier",
    "Career Development",
    "Anxiety",
    "Manage stress",
    "Relationships",
    "Self-Confidence",
    "Work-Life Balance",
    "Self-care",
    "Health & Fitness/Body Image",
    "Financial Stability",
    "Motivation",
    "Time Management/Productivity",
  ];

  const toggleChip = (option) => {
    if (selectedChips.includes(option)) {
      setSelectedChips(selectedChips.filter(item => item !== option));
    } else {
      setSelectedChips([...selectedChips, option]);
    }
  };

  const handleContinue = () => {
    console.log(selectedChips);
    navigation.navigate('OnboardingScreen4');
  };

  return (
    <ImageBackground source={IMAGES.gradientbg} style={styles.background}>
     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightBlue} size={48} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.question}>Select your goals.</Text>
        <View style={styles.chipContainer}>
          {options.map((option) => (
            <Chip
              key={option}
              mode="outlined"
              selected={selectedChips.includes(option)}
              onPress={() => toggleChip(option)}
              style={styles.chip}
              
            >
              {option}
            </Chip>
          ))}
        </View>
        <Button mode="contained" onPress={handleContinue} style={styles.button} theme={{ colors: { primary: COLORS.mindstormBlue } }} >
          Continue
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10, // Ensure the back button is above the chat bubbles
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure the background color is transparent to show the image
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  chipContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  chip: {
    margin: 10,
    borderColor: '#ccc',
  },
  button: {
    marginTop: 20,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default OnboardingScreen2;
