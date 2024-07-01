import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip, Button } from 'react-native-paper';

const OnboardingScreen2 = ({ navigation }) => {
  const [selectedChips, setSelectedChips] = useState([]);
  console.log('selectedChips:', selectedChips);
  const options = [
    "Be Happier",
    "Career Development",
    "Anxiety",
    "Manage stress",
    "Relationships",
    "Self-Confidence",
    "Work-Life Balance",
    "Self-care",
    "Health & Fitness/Body Image",
    "Financial Stability",
    "Motivation",
    "Time Management/Productivity",
  ];

  const toggleChip = (option) => {
    if (selectedChips.includes(option)) {
      setSelectedChips(selectedChips.filter(item => item !== option));
    } else {
      setSelectedChips([...selectedChips, option]);
    }
  };

  const handleContinue = () => {
    console.log(selectedChips);
    navigation.navigate('OnboardingScreen4');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Select your goals.  </Text>
      <View style={styles.chipContainer}>
        {options.map((option) => (
          <Chip
            key={option}
            mode="outlined"
            selected={selectedChips.includes(option)}
            onPress={() => toggleChip(option)}
            style={styles.chip}
          >
            {option}
          </Chip>
        ))}
      </View>
      <Button mode="contained" onPress={handleContinue} style={styles.button}>
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10
  },
  chipContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
    marginBottom: 20,
  },
  chip: {
    margin: 10,
    borderColor: '#ccc',
  },
  button: {
    marginTop: 20,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default OnboardingScreen2;