import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useOnboardingContext } from "../contexts/onboardingContext";
// const { setOnboardingComplete } = useOnboardingContext();
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons



const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function PersonalInfoScreen({ setOnboardingComplete }) {
  const navigation = useNavigation();
  const [gender, setGender] = useState();
  const [age, setAge] = useState();
  const [occupation, setOccupation] = useState();
  const [openGender, setOpenGender] = useState(false);
  const [openAge, setOpenAge] = useState(false);
  const [openOccupation, setOpenOccupation] = useState(false);


  const Chip = ({ label, selected, onSelect }) => (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={() => onSelect(label)}
    >
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
  
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState(null);

  const genders = ['Female', 'Male', 'Non-binary'];
  const ageGroups = [
    '18-23',
    '24-34',
    '35-44',
    '45-64',
    '65+'
  ];
  // const ageGroups = [
  //   'Young Adult (18-23)',
  //   'Early Adulthood (24-34)',
  //   'Early Middle Age (35-44)',
  //   'Late Middle Age (45-64)',
  //   'Late Adult (65+)'
  // ];
  const occupations = ['Student', 'Teacher', 'Retail', 'Technology', 'Law'];

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
        Occupation
      </Text>
      {/* Occupation Chips */}
      <View style={styles.chipContainer}>
        {occupations.map((occupation) => (
          <Chip
            key={occupation}
            label={occupation}
            selected={selectedOccupation === occupation}
            onSelect={setSelectedOccupation}
            style={styles.chipText}
          />
        ))}
      </View>

  
       
        <View style={styles.paginationContainer}>
          <View style={styles.paginationInactive} />
          <View style={styles.paginationInactive} />
          <View style={styles.paginationActive} />
          <View style={styles.paginationInactive} />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={() => setOnboardingComplete(true)}>
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