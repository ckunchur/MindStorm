import { React, useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { updatePersonalInfo } from "../firebase/functions";
import { genders, ageGroups } from "../data/optionSettings";
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const Chip = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={() => onSelect(label)}
  >
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2";

export default function PersonalInfoScreen({ setOnboardingComplete }) {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [relaxActivities, setRelaxActivities] = useState(null);
  const [hobbies, setHobbies] = useState(null);
  const fontsLoaded = useGlobalFonts();

  if (!fontsLoaded) {
    return null;
  }

  const handleContinue = async (uid) => {
    console.log(selectedAge, selectedGender, hobbies, relaxActivities);
    await updatePersonalInfo(uid, selectedGender, selectedAge, relaxActivities, hobbies);
    setOnboardingComplete(true);
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
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subheaderText}>
          Optional information to help us cater to your needs
        </Text>
        {/* Gender Chips */}
        <Text style={styles.chipHeader}>Gender</Text>
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
        <Text style={styles.chipHeader}>Age</Text>
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
        <Text style={styles.inputHeader}>How do you relax?</Text>
        <Text style={styles.inputSubtext}>Ex: meditating, going for a walk, etc.</Text>
        <TextInput
          placeholder="Listening to bird sounds"
          value={relaxActivities}
          onChangeText={setRelaxActivities}
          style={styles.input}
          placeholderTextColor="grey"
        />
        <Text style={styles.inputHeader}>Any current hobbies?</Text>
        <Text style={styles.inputSubtext}>Ex: swimming, baking, reading sci-fi</Text>
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
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
    zIndex: 10,
  },
  inputHeader: {
    color: COLORS.maintextcolor,
    fontSize: width * 0.045,
    marginTop: height * 0.01,
    fontFamily: "Inter-Medium",
  },
  inputSubtext: {
    color: COLORS.maintextcolor,
    fontSize: width * 0.035,
    fontFamily: "Inter-Regular",
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.06,
    width: '100%',
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.01,
    color: 'grey',
    fontFamily: "Inter-Regular",
  },
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    color: COLORS.maintextcolor,
    fontSize: width * 0.08,
    fontWeight: "700",
    fontFamily: "Inter-Medium",
    marginTop: height * 0.07,
    textAlign: 'center',
  },
  subheaderText: {
    color: COLORS.maintextcolor,
    fontSize: width * 0.04,
    fontFamily: "Inter-Regular",
    marginTop: height * 0.01,
    // marginBottom: height * 0.02,
    textAlign: 'center',
  },
  chipHeader: {
    color: COLORS.maintextcolor,
    fontSize: width * 0.05,
    fontFamily: "Inter-Medium",
    marginTop: height * 0.02,
  },
  chipText: {
    color: COLORS.secondarytextcolor,
    fontWeight: 'bold',
    fontFamily: "Inter-Medium",
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    width: '90%',
  },
  chip: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    margin: width * 0.01,
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: "#BCC6FC",
  },
  paginationContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    display: "flex",
    marginTop: height * 0.01,
    flexDirection: "row",
    gap: width * 0.02,
  },
  paginationActive: {
    borderRadius: 100,
    backgroundColor: "#FF90D3",
    height: width * 0.02,
    width: width * 0.02,
  },
  paginationInactive: {
    borderRadius: 100,
    backgroundColor: "#E3E5E5",
    height: width * 0.02,
    width: width * 0.02,
  },
  continueButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 48,
    backgroundColor: 'white',
    position: "relative",
    width: "100%",
    maxWidth: width * 0.8,
    borderColor: COLORS.mindstormLightPurple,
    borderWidth: 1,
    textAlign: "center",
    marginTop: height * 0.03,
    padding: height * 0.02,
    fontSize: width * 0.04,
    fontWeight: "700",
    fontFamily: "Inter-Medium",
  },
  
  continueButtonText: {
    color: COLORS.mindstormLightPurple,
    fontWeight: 'bold',
    fontFamily: "Inter-Medium",
    paddingVertical: 5,
  },
});