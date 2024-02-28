import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useOnboardingContext } from "../contexts/onboardingContext";
// const { setOnboardingComplete } = useOnboardingContext();
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { signInUser } from "../firebase/functions";


const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function LogIn({setOnboardingComplete}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const success = await signInUser(email, password);
      if (success) {
        Alert.alert("Sign In Successful", "Welcome back!");
        setOnboardingComplete(true);
      }
    } catch (error) {
      // Handle specific error codes for sign-in failures
      let errorMessage = "An error occurred during sign-in. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No user found with this email. Please check your email and try again.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      }
      Alert.alert("Sign In Failed", errorMessage);
    }
  };
  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={require('../assets/onboarding-background.png')}
        style={styles.fullScreen}
      >
        <WelcomeTitle title="Log In" style={styles.title} />
        <WelcomeMessage message="Sign into an existing account" style={styles.subheaderText} />
       
       <Text style={styles.inputHeader}>
        Email
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="grey"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      

      <Text style={styles.inputHeader}>
        Password
      </Text>
     
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="grey"
        secureTextEntry
      />

     
       

        <TouchableOpacity style={styles.continueButton} onPress={handleSignIn}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 80, // Adjusted to be below status bar
    left: 20,
    zIndex: 10, // Ensure the back button is above the chat bubbles
  },
  fullScreenContainer: {
    flex: 1, // Make the container fill the whole screen
  },
  fullScreen: {
    flex: 1, // Make the background image fill the whole screen
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    marginTop: 72, // Adjust the value as needed
  },
  subheaderText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    marginBottom: 50, // Adjust the value as needed
  },

  inputSubheader: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  inputHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: "Inter, sans-serif",
  },
 
  input: {
    height: 40,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: 'black',
  },
  
  continueButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "#FFF",
    position: "relative",
    width: "100%",
    maxWidth: 327,
    color: "#4A9BB4",
    textAlign: "center",
    marginTop: 96,
    // marginVertical: 29,
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  continueButtonText: {
    color: "#4A9BB4",
    fontWeight: 'bold'
  },
});