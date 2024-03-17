import { React, useState } from "react";
import { View, Image, StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { signInUser } from "../firebase/functions";
import { COLORS, IMAGES} from '../styles/globalStyles';
import { useUser } from '../contexts/UserContext'; // Adjust the import path as necessary


export default function LogIn({ setOnboardingComplete }) {
  const { setUserId } = useUser();

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = async () => {
    try {
      const success = await signInUser(email, password, setUserId);
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
        <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={IMAGES.gradientbg}
        style={styles.fullScreen}
      >
        <Text style={styles.title}>Log In</Text>
        <Image
        resizeMode="contain"
        source={require('../assets/buddy-group.png')}
        style={styles.buddyImage}
      />
        <Text style={styles.subheaderText}>Sign into an existing account</Text>
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
    top: 80, 
    left: 20,
    zIndex: 10, 
  },
  buddyImage: {
    maxWidth: '60%',
    maxHeight: '20%',
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
    borderRadius: 16,
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
    padding: 18,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    borderColor: COLORS.mindstormLightPurple,
    borderWidth: 1,
  },
  continueButtonText: {
    color: COLORS.mindstormLightPurple,
    fontWeight: 'bold',
   
  },
});