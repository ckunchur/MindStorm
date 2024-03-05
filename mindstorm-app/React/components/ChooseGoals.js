import {React, useState} from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updatePersonalGoals } from "../firebase/functions";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;
const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"


export default function ChooseGoalsScreen() {
  const navigation = useNavigation();

  const goalOptions = [
    { key: "reduceAnxiety", title: "Reduce anxiety"},
    { key: "mindfulness", title: "Practice mindfulness"},
    { key: "productivity", title: "Boost productivity"},
    { key: "gratitude", title: "Practice gratitude"},
  ];

  const GoalOption = ({ title, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.goalOption, isSelected && styles.goalOptionSelected]}>
      <Text style={[styles.goalOptionText, isSelected && styles.goalOptionTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );
  

  const [selectedGoals, setSelectedGoals] = useState([]);
  const [currentStruggles, setCurrentStruggles] = useState(null);

 

  const toggleGoal = (key) => {
    setSelectedGoals((prevSelectedGoals) => {
      // Check if the goal is already selected
      const index = prevSelectedGoals.indexOf(key);
      if (index > -1) {
        // If the goal is already selected, remove it from the array
        return prevSelectedGoals.filter((_, i) => i !== index);
      } else {
        // If the goal is not selected, add it to the array
        return [...prevSelectedGoals, key];
      }
    });
  };
  console.log("goals", selectedGoals)
  console.log("currentStruggles", currentStruggles)
   
  const handleContinue = async (uid) => {
    await updatePersonalGoals(uid, selectedGoals, currentStruggles);
    console.log("hello")
    navigation.navigate('PersonalInfo')
  };

  return(
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color="white" size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={require('../assets/onboarding-background.png')}
        style={styles.fullScreen}
      > 
        <WelcomeTitle title="What are your goals?" style={styles.title} />
        <WelcomeMessage message="No pressure! You can always change these later." style={styles.subheaderText} />
        
        <View style={styles.goalsContainer}>
          {goalOptions.map((option) => (
            <GoalOption 
            key={option.key}
            title={option.title}
            isSelected={!!selectedGoals[option.key]}
            onPress={() => toggleGoal(option.key)}
             />
          ))}
        </View>

        <Text style={styles.inputHeader}>
         Anything currently bothering you?
        </Text>
        <Text style={{ color: 'white' }}>
          Ex: recent breakup, struggling in school, etc
        </Text>

        <TextInput
          placeholder="Uncertain about my post-graduation plans"
          value={currentStruggles}
          onChangeText={setCurrentStruggles}
          style={styles.input}
          placeholderTextColor="grey"
        />
        
        <View style={styles.paginationContainer}>
          <View style={styles.paginationInactive} />
          <View style={styles.paginationActive} />
          <View style={styles.paginationInactive} />
          <View style={styles.paginationInactive} />
        </View>
        
        <TouchableOpacity style={styles.continueButton} 
        onPress={() => handleContinue(testUser)}
        >
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
 inputHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    fontFamily: "Inter, sans-serif",
  },
  fullScreenContainer: {
    flex: 1, // Make the container fill the whole screen
  },
  fullScreen: {
    flex: 1, // Make the background image fill the whole screen
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally
  },
  input: {
    height: 50,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: 'grey',
    
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    marginTop: 108, // Adjust the value as needed
  },
  subheaderText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    marginBottom: 24, // Adjust the value as needed
  },
  goalsContainer: {
    width: '90%', // Adjust the width as needed
    justifyContent: 'space-around', // This will distribute space evenly around the GoalOption components
    alignItems: 'center',
    flexDirection: 'row', // Arrange children in a row
    flexWrap: 'wrap', // Allow wrapping of children
  },
  goalOption: {
    width: '80%', // Adjust the width as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 28,
    margin: 8, // Ensure there's a margin between the boxes
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  goalOptionText: {
    fontFamily: "Inter, sans-serif",
    textAlign: 'center',
    color: '#7887DA',
    fontWeight: 'bold',
    fontSize: 16,
  },

  goalOptionSelected: {
    backgroundColor: "white", // Full opacity
    borderWidth: 4, // Thicker border
    borderColor: "#BCC6FC",

  },
  goalOptionTextSelected: {
   fontWeight: "bold", // Example selected text color, change as needed
  },
  paginationContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    display: "flex",
    marginTop: 32,
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
    marginTop: 24,
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