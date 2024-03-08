import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ExtractEntriesFromFirebase, readChatHistoryFromFirebase, testUser } from "../firebase/functions";
import { upsertChatSessionsToPinecone} from "../Pinecone/pinecone-requests";
const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // const upsertChatsTest = async () => {
  //   try {
  //     // Extract chats from Firebase
  //     const chats = await readChatHistoryFromFirebase(testUser);
  //     // Upsert chats into Pinecone
  //     const pineconeResponse = await upsertChatSessionsToPinecone(chats);
  //     console.log("Entries upserted into Pinecone index:", pineconeResponse);
  //     // Navigation happens after the async tasks are completed
  //     navigation.navigate('ChooseGoals');
  //   } catch (error) {
  //     console.error('Error during test:', error);
  //   }
// };

return (
  <View style={styles.container}>
    <WelcomeTitle title="Welcome to MindStorm" style={styles.blueTitle} />
    <WelcomeMessage message="Learn how to find the calm in your storm" style={styles.greyMessage} />
    <Image 
      resizeMode="contain" 
      source={require('../assets/cloud-egg-1.png')} 
      style={styles.welcomeImage} 
    />
    <TouchableOpacity style={styles.getStartButton}  onPress={() => navigation.navigate('ChooseGoals')}>
      <Text style={styles.getStartButtonText}>Get Started</Text>
    </TouchableOpacity>
    <View style={styles.loginOption}>
      <Text style={styles.loginText}>Have an account? 
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('LogInScreen')}><Text style={styles.loginLinkText}> Log in</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    backgroundColor: "#FFF",
    alignItems: "center",
    maxWidth: 480,
    width: "100%",
    margin: "auto",
    padding: 47,
  },
  title: {
    position: 'absolute',
    top: 100,
    color: "#4A9BB4",
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
},
  blueTitle: {
    color: "#4A9BB4",
    marginTop: 99,
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  greyMessage: {
    color: "#7D7979",
    marginTop: 32,
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  welcomeImage: {
    marginTop: 35,
    maxWidth: 303,
    aspectRatio: 1,
  },
  titleText: {
    textAlign: "center",
  },
  messageText: {
    width: 324,
    textAlign: "center",
  },
  getStartButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: "#7887DA",
    alignSelf: "stretch",
    marginTop: 51,
    paddingVertical: 18,
    paddingHorizontal: 60,
  },
  getStartButtonText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontFamily: "Inter, sans-serif",
  },
  loginOption: {
    marginTop: 23,
    display: 'flex',
    flexDirection: 'row'

    
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

