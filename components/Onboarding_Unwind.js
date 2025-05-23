import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { IMAGES, COLORS } from '../styles/globalStyles'; // Adjust the path as necessary
import { Ionicons } from '@expo/vector-icons';

const OnboardingScreen4 = ({ navigation }) => {
  const [about, setAbout] = useState('');

  const handleContinue = () => {
    navigation.navigate('OnboardingScreen3');
  };

  return (
    <ImageBackground source={IMAGES.gradientbg} style={styles.background}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightBlue} size={48} />
      </TouchableOpacity><View style={styles.container}>
        <Text style={styles.title}>Share your favorite ways to calm down and unwind.</Text>
        <TextInput
          style={styles.input}
          placeholder="This could be anything from reading a book, going for a walk, or listening to music. We want to know what helps you relax and destress!"
          value={about}
          onChangeText={setAbout}
          multiline={true}
          mode="outlined"
          theme={{ colors: { primary: COLORS.mindstormBlue } }} 
        />
        <Button mode="contained" onPress={handleContinue} style={styles.button}  theme={{ colors: { primary: COLORS.mindstormBlue } }} >
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent', // Ensure the background color is transparent to show the image
  },
  title: {
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 60, // Increased marginBottom for more space
    padding: 10,
    textAlign: 'left',
  },
  button: {
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

export default OnboardingScreen4;
