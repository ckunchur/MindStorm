import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const OnboardingScreen1 = ({ navigation }) => {
  const [hobbies, setHobbies] = useState('');
  const [stressors, setStressors] = useState([]);
  const [otherStressors, setOtherStressors] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const stressorsOptions = [
    { label: "Work", value: "work" },
    { label: "Family", value: "family" },
    { label: "Relationships", value: "relationships" },
    { label: "Health", value: "health" },
    { label: "Finances", value: "finances" },
    { label: "Other (please specify below)", value: "other" },
  ];

  const toggleStressors = (value) => {
    setStressors((prevStressors) =>
      prevStressors.includes(value)
        ? prevStressors.filter((item) => item !== value)
        : [...prevStressors, value]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header for hobbies */}
      <Text style={styles.header}>What are your favorite hobbies?</Text>
      {/* Subtitle for hobbies */}
      <Text style={styles.subtitle}>Please fill in the field.</Text>
      {/* Text input for hobbies */}
      <TextInput
        style={styles.input}
        placeholder="Cooking, swimming, cuddling my dog..."
        value={hobbies}
        onChangeText={setHobbies}
      />
      
      {/* Header for stressors */}
      <Text style={styles.header}>What are your main stressors/sources of unhappiness?</Text>
      {/* Touchable for opening the checklist modal */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.dropdownText}>Please select (multiple if needed)</Text>
      </TouchableOpacity>

      {/* Text input for other stressors */}
      <TextInput
        style={[styles.input, { marginTop: 20 }]}
        placeholder="Selected other or have anything to add?"
        value={otherStressors}
        onChangeText={setOtherStressors}
      />

      {/* Info text */}
      <Text style={styles.infoText}>
        Your information is private and secure. Whatever context you provide will only be used to help your companion better understand you.
      </Text>
      
      {/* Next button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OnboardingScreen2')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for checklist */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Select Your Stressors</Text>
          <ScrollView style={styles.scrollView}>
            {stressorsOptions.map((option) => (
              <View key={option.value} style={styles.checkboxContainer}>
                <CheckBox
                  value={stressors.includes(option.value)}
                  onValueChange={() => toggleStressors(option.value)}
                />
                <Text style={styles.checkboxLabel}>{option.label}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="Done" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f0f2f5',
    },
    header: {
      // Header for hobbies and stressors
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
    subtitle: {
      // Subtitle for hobbies
      fontSize: 14,
      color: '#888',
      marginBottom: 20,
      alignSelf: 'flex-start',
    },
    input: {
      // Text input for hobbies and other stressors
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      width: '100%',
      borderRadius: 15,
      marginBottom: 20,
      padding: 10,
      textAlign: 'left',
    },
    dropdown: {
      // Touchable for opening the checklist modal
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 15,
      width: '100%',
      justifyContent: 'center',
      marginBottom: 20,
      paddingLeft: 10,
    },
    dropdownText: {
      // Text inside the dropdown touchable
      fontSize: 14,
      color: '#888',
    },
    infoText: {
      // Info text
      fontSize: 12,
      color: '#888',
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      // Container for the Next button
      alignItems: 'center',
      marginTop: 20,
    },
    button: {
      // Styles for the Next button
      backgroundColor: '#fff',
      borderRadius: 15,
      height: 50,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      // Text inside the Next button
      color: '#000',
      fontSize: 16,
      fontWeight: 'medium',
    },
    modalContainer: {
      // Container for the checklist modal
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    modalHeader: {
      // Header inside the modal
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    scrollView: {
      // ScrollView inside the modal
      marginBottom: 20,
    },
    checkboxContainer: {
      // Container for each checkbox item
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkboxLabel: {
      // Label for each checkbox item
      marginLeft: 10,
      fontSize: 16,
    },
    modalButton: {
      // Styles for the Done button inside the modal
      backgroundColor: '#fff',
      borderRadius: 15,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 20,
    },
    modalButtonText: {
      // Text inside the Done button
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
export default OnboardingScreen1;
