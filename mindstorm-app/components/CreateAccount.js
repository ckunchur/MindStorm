import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useOnboardingContext } from "../contexts/onboardingContext";
// const { setOnboardingComplete } = useOnboardingContext();
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { signUpUser } from "../firebase/functions";


const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function CreateAccount({ setOnboardingComplete }) {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleContinue = async () => {
    

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        Alert.alert("Error", "All fields must be filled.");
        return;
      }
    if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match. Please make sure your passwords match.");
        return;
    }
    try {
      await signUpUser(name, email, password);
      // Assuming signUpUser will throw for errors, this line is only reached if signUp is successful
      Alert.alert("Sign Up Successful", "Your account has been created successfully.", [
        { text: "OK", onPress: () => navigation.navigate('ChooseGoals') }
      ]);
    } catch (error) {
      console.error("Signup Error:", error);
      let errorMessage = "An error occurred. Please try again later.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please use a different email.";
      } else if (error.code) {
        // Handle other specific error codes here
        errorMessage = error.message; // Generic error message from Firebase
      }
      
      Alert.alert("Sign Up Failed", errorMessage);
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
        <WelcomeTitle title="Create Account" style={styles.title} />
        <WelcomeMessage message="Create an account to get started!" style={styles.subheaderText} />
       
       <Text style={styles.inputHeader}>
        Name
      </Text>
      <Text style={styles.inputSubheader}>
       What should we call you?

      </Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="grey"
      />

    
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
      <Text style={styles.inputSubheader}>
       *At least 6 characters

      </Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="grey"
        secureTextEntry
      />

      <Text style={styles.inputHeader}>
        Confirm Password
      </Text>
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholderTextColor="grey"
        secureTextEntry
      />
    
    
        <View style={styles.paginationContainer}>
          <View style={styles.paginationActive} />
          <View style={styles.paginationInactive} />
          <View style={styles.paginationInactive} />
          <View style={styles.paginationInactive} />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
  
  paginationContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    display: "flex",
    marginTop: 48,
    flexDirection: "row",
    gap: 8,
  },
  paginationActive: {
    borderRadius: 100,
    backgroundColor: "#FF90D3",
    height: 8,
    width: 8,
  },
  paginationInactive: {
    borderRadius: 100,
    backgroundColor: "#E3E5E5",
    height: 8,
    width: 8,
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