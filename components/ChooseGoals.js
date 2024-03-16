import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updatePersonalGoals } from "../firebase/functions";
import { Ionicons } from '@expo/vector-icons';
import { goalOptions } from "../data/optionSettings";
import { testUser } from "../firebase/functions";
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

export default function ChooseGoalsScreen() {
  const navigation = useNavigation();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [currentStruggles, setCurrentStruggles] = useState("");
  const fontsLoaded = useGlobalFonts();

  if (!fontsLoaded) {
    return null;
  }

  const GoalOption = ({ title, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[isSelected ? styles.goalOptionSelected : styles.goalOption]}>
      <Text style={[styles.goalOptionText, isSelected && styles.goalOptionTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );

  const toggleGoal = (key) => {
    console.log(selectedGoals);
    setSelectedGoals((prevSelectedGoals) => {
      const index = prevSelectedGoals.indexOf(key);
      if (index > -1) {
        return prevSelectedGoals.filter((_, i) => i !== index);
      } else {
        return [...prevSelectedGoals, key];
      }
    });
  };

  const handleContinue = async (uid) => {
    console.log(currentStruggles);
    await updatePersonalGoals(uid, selectedGoals, currentStruggles);
    navigation.navigate('PersonalInfo');
  };

  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightGrey} size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={IMAGES.gradientbg}
        style={styles.fullScreen}
      >
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subheaderText}>No pressure! You can always change these later.</Text>
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
        <Text style={styles.inputHeader}>Anything currently bothering you?</Text>
        <Text style={styles.inputSubtext}>Ex: recent breakup, struggling in school, etc</Text>
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
    fontSize: width * 0.04,
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
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  input: {
    height: height * 0.06,
    width: '100%',
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.01,
    fontFamily: "Inter-Regular",
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
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  goalsContainer: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalOption: {
    width: '85%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: COLORS.transcluscentWhite,
    padding: width * 0.06,
    margin: width * 0.02,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  goalOptionText: {
    fontFamily: "Inter-Regular",
    textAlign: 'center',
    color: COLORS.maintextcolor,
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  goalOptionSelected: {
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#BCC6FC",
  },
  goalOptionTextSelected: {
    fontFamily: "Inter-SemiBold",
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
    fontFamily: "Inter-SemiBold",
    paddingVertical: 5,
  },
});