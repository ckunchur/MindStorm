import React from "react";
import { Dimensions, View, StyleSheet, Text, Image, TouchableOpacity , ImageBackground} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ExtractEntriesFromFirebase, readChatHistoryFromFirebase, testUser } from "../firebase/functions";
import { upsertChatSessionsToPinecone, upsertEntriesToPinecone} from "../Pinecone/pinecone-requests";
const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES} from '../styles/globalStyles';
const { width, height } = Dimensions.get('window');


export default function WelcomeScreen() {
  const navigation = useNavigation();
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) {
    return null;
  }   

  const upsertChatsTest = async () => {
    try {
      // Extract chats from Firebase
      const chats = await readChatHistoryFromFirebase(testUser);
      // Upsert chats into Pinecone
      const pineconeResponse = await upsertChatSessionsToPinecone(chats);
      console.log("Entries upserted into Pinecone index:", pineconeResponse);
      // Navigation happens after the async tasks are completed
      navigation.navigate('ChooseGoals');
    } catch (error) {
      console.error('Error during test:', error);
    }
};

const upsertEntriesTest = async () => {
  try {
    // Extract chats from Firebase
    const entries = await ExtractEntriesFromFirebase(testUser);
    // Upsert chats into Pinecone
    const pineconeResponse = await upsertEntriesToPinecone(entries);
    console.log("Entries upserted into Pinecone index:", pineconeResponse);
    // Navigation happens after the async tasks are completed
    navigation.navigate('ChooseGoals');
  } catch (error) {
    console.error('Error during test:', error);
  }
};

return (
  <ImageBackground
    resizeMode="cover"
    source={IMAGES.gradientbg}
    style={styles.fullScreen}
  >
    <View style={styles.container}>
      <WelcomeTitle title="Welcome to MindStorm" style={styles.blueTitle} />
      <WelcomeMessage message="Learn how to find the calm in your storm" style={styles.secondaryMessage} />
      <Image
        resizeMode="contain"
        source={require('../assets/wave-logo.png')}
        style={styles.welcomeImage}
      />
      <TouchableOpacity style={styles.getStartButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.getStartButtonText}>Get Started</Text>
      </TouchableOpacity>
      <View style={styles.loginOption}>
        <Text style={styles.loginText}>Have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LogInScreen')}>
          <Text style={styles.loginLinkText}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  borderRadius: 24,
  alignItems: "center",
  maxWidth: '100%',
  width: "100%",
  margin: "auto",
  padding: '10%',
},
fullScreen: {
  flex: 1,
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
},
blueTitle: {
  color: COLORS.maintextcolor,
  marginTop: '25%',
  fontSize: width * 0.09,
  fontFamily: "Inter-Medium",
},
secondaryMessage: {
  color: COLORS.mindstormLightBlue,
  marginTop: '8%',
  fontSize: width * 0.04,
  fontFamily: "Inter-Regular",
},
welcomeImage: {
  maxWidth: '100%',
  // maxHeight: '60%',
  margin: '20%',
  aspectRatio: 1,
},
titleText: {
  textAlign: "center",
},
messageText: {
  width: '80%',
  textAlign: "center",
},
// getStartButton: {
//   justifyContent: "center",
//   alignItems: "center",
//   borderRadius: 48,
//   backgroundColor: 'white',
//   alignSelf: "stretch",
//   marginTop:0,
//   paddingVertical: '8%',
//   paddingHorizontal: '15%',
//   borderColor: COLORS.mindstormLightBlue,
//   borderWidth: 1,

// },
getStartButton: {
  alignItems: 'center',
  marginTop: 30, 
  height: 50,
  width: '90%',
  alignSelf: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.mindstormBlue,
  borderRadius: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
getStartButtonText: {
  color: 'white',
  // fontWeight: 'bold',
  fontFamily: "Inter",
},

loginOption: {
  marginTop: '6%',
  display: 'flex',
  flexDirection: 'row',
},
loginText: {
  fontFamily: "Inter, sans-serif",
  color: COLORS.mindstormLightGrey,
},
loginLinkText: {
  fontWeight: "500",
  textDecorationLine: "underline",
  color: COLORS.mindstormLightBlue,
},
});