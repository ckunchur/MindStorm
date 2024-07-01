import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { signUpUser } from "../../firebase/functions";
import { COLORS, IMAGES } from "../../styles/globalStyles";
import { useUser } from '../../contexts/UserContext'; // Adjust the import path as necessary


export default function CreateAccount() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserId } = useUser();

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
      await signUpUser(name, email, password, setUserId);
      Alert.alert("Sign Up Successful", "Your account has been created successfully.", [
        { text: "OK", onPress: () => navigation.navigate('ChooseGoals') }
      ]);
    } catch (error) {
      console.error("Signup Error:", error);
      let errorMessage = "An error occurred. Please try again later.";

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please use a different email.";
      } else if (error.code) {
        errorMessage = error.message; // generic error message from Firebase
      }
      Alert.alert("Sign Up Failed", errorMessage);
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={IMAGES.gradientbg}
        style={styles.fullScreen}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subheaderText}>Create an account to get started!</Text>
        <Text style={styles.inputHeader}>Name</Text>
        <Text style={styles.inputSubheader}>What should we call you?</Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="grey"
        />
        <Text style={styles.inputHeader}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="grey"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.inputHeader}>Password</Text>
        <Text style={styles.inputSubheader}>*At least 6 characters</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="grey"
          secureTextEntry
        />
        <Text style={styles.inputHeader}>Confirm Password</Text>
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
    top: 80,
    left: 20,
    zIndex: 10, // Ensure the back button is above the chat bubbles
  },
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.maintextcolor,
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    marginTop: 72,
  },
  subheaderText: {
    color: COLORS.secondarytextcolor,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    marginBottom: 50,
  },
  inputSubheader: {
    color: COLORS.secondarytextcolor,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  inputHeader: {
    color: COLORS.secondarytextcolor,
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
    backgroundColor: COLORS.secondarytextcolor,
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
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    borderColor: COLORS.mindstormLightPurple,
    borderWidth: 1,
  },
  continueButtonText: {
    color: COLORS.mindstormLightPurple,
    fontWeight: 'bold'
  },
});