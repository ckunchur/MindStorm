import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { updatePersonalInfo } from "../firebase/functions";


const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;
const Chip = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={() => onSelect(label)}
  >
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"

export default function PersonalInfoScreen({ setOnboardingComplete }) {
  const navigation = useNavigation();
 
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [relaxActivities, setRelaxActivities] = useState(null);
  const [hobbies, setHobbies] = useState(null);
  const genders = ['Female', 'Male', 'Non-binary'];
  const ageGroups = [
    '18-23',
    '24-34',
    '35-44',
    '45-64',
    '65+'
  ];
 


  const handleContinue = async (uid) => {
    console.log(selectedAge, selectedGender, hobbies, relaxActivities);
    await updatePersonalInfo(uid, selectedGender, selectedAge, relaxActivities, hobbies);
    setOnboardingComplete(true);
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
        <WelcomeTitle title="Who are you?" style={styles.title} />
        <WelcomeMessage message="Want to start off with more
        personalized results? Answer some optional questions about yourself." style={styles.subheaderText} />

        {/* Gender Chips */}
        <Text style={styles.chipHeader}>
          Gender
        </Text>
        <View style={styles.chipContainer}>
          {genders.map((gender) => (
            <Chip
              key={gender}
              label={gender}
              selected={selectedGender === gender}
              onSelect={setSelectedGender}
            />
          ))}
        </View>


        {/* Age Chips */}
        <Text style={styles.chipHeader}>
          Age
        </Text>
        <View style={styles.chipContainer}>
          {ageGroups.map((age) => (
            <Chip
              key={age}
              label={age}
              selected={selectedAge === age}
              onSelect={setSelectedAge}
            />
          ))}
        </View>


        
        <Text style={styles.chipHeader}>
          How do you relax?
        </Text>
        <Text style={{ color: 'white' }}>
          Ex: meditating, going for a walk, etc.
        </Text>

        <TextInput
          placeholder="Listening to bird sounds"
          value={relaxActivities}
          onChangeText={setRelaxActivities}
          style={styles.input}
          placeholderTextColor="grey"
        />

        <Text style={styles.chipHeader}>
          Any current hobbies?
        </Text>
        <Text style={{ color: 'white' }}>
          Ex: swimming, baking, reading sci-fi
        </Text>

        <TextInput
          placeholder="Baking muffins"
          value={hobbies}
          onChangeText={setHobbies}
          style={styles.input}
          placeholderTextColor="grey"
        />





        <View style={styles.paginationContainer}>
          <View style={styles.paginationInactive} />
          <View style={styles.paginationInactive} />
          <View style={styles.paginationActive} />
          <View style={styles.paginationInactive} />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={() => handleContinue(testUser)}>
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
  input: {
    height: 40,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: 'grey',
  },

  fullScreenContainer: {
    flex: 1, // Make the container fill the whole screen
  },
  fullScreen: {
    flex: 1, // Make the background image fill the whole screen
    justifyContent: 'center', // Center the children vertically
    alignItems: 'center', // Center the children horizontally,

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

  chipHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  chipText: {
    color: "#7887DA",
    fontWeight: 'bold',
    zIndex: 10
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%'
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    zIndex: 9
  },
  chipSelected: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 4, // Thicker border
    borderColor: "#BCC6FC",

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
    marginTop: 48,
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