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
      <WelcomeMessage message="Learn how to find the calm in your storm" style={styles.greyMessage} />
      <Image
        resizeMode="contain"
        source={require('../assets/cloud-egg-1.png')}
        style={styles.welcomeImage}
      />
      <TouchableOpacity style={styles.getStartButton} onPress={() => navigation.navigate('ChooseGoals')}>
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
  color: COLORS.mindstormGrey,
  marginTop: '25%',
  fontSize: width * 0.09,
  fontFamily: "Inter-Medium",
},
greyMessage: {
  color: COLORS.mindstormGrey,
  marginTop: '8%',
  fontSize: width * 0.04,
  fontFamily: "Inter-Regular",
},
welcomeImage: {
  marginTop: '5%',
  maxWidth: '100%',
  aspectRatio: 1,
},
titleText: {
  textAlign: "center",
},
messageText: {
  width: '80%',
  textAlign: "center",
},
getStartButton: {
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 48,
  backgroundColor: "#7887DA",
  alignSelf: "stretch",
  marginTop: '8%',
  paddingVertical: '8%',
  paddingHorizontal: '15%',
},
getStartButtonText: {
  color: "#FFF",
  fontWeight: 'bold',
  fontFamily: "Inter-Regular",
},
loginOption: {
  marginTop: '6%',
  display: 'flex',
  flexDirection: 'row',
},
loginText: {
  fontFamily: "Inter, sans-serif",
  color: "#000",
},
loginLinkText: {
  fontWeight: "500",
  textDecorationLine: "underline",
  color: "#4A9BB4",
},
});