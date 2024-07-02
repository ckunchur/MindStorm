import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Checkbox, Button, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';

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

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header for hobbies */}
          <Text style={styles.header}>How would you describe your mental state lately?</Text>
          {/* Subtitle for hobbies */}
          <Text style={styles.subtitle}>Please fill in the field.</Text>
          {/* Text input for hobbies */}
          <TextInput
            style={styles.input}
            placeholder="Feeling exhausted and unmotivated, happy and relaxed..."
            value={hobbies}
            multiline={true}
            onChangeText={setHobbies}
          />

          {/* Header for stressors */}
          <Text style={styles.header}>What are your main stressors/sources of unhappiness?</Text>
          {/* Touchable for opening the checklist modal */}
          <Button mode="outlined" onPress={() => setIsModalVisible(true)} style={styles.dropdown}>
            Please select (multiple if needed)
          </Button>

          {/* Header for other stressors */}
          <Text style={styles.header}>Feel free to elaborate on your stressors or situation below.</Text>
          {/* Text input for other stressors */}
          <TextInput
            style={[styles.input, { marginTop: 20 }]}
            placeholder="Selected other or have anything to add?"
            value={otherStressors}
            multiline={true}
            onChangeText={setOtherStressors}
          />

          {/* Info text */}
          <Text style={styles.infoText}>
            Your information is private and secure. Whatever context you provide will only be used to help your companion better understand you.
          </Text>

          {/* Next button */}
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => navigation.navigate('OnboardingScreen2')} style={styles.button}>
              Continue
            </Button>
          </View>
        </ScrollView>

        {/* Modal for checklist */}
        <Portal>
          <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={containerStyle}>
            <Text style={styles.modalHeader}>Select Your Stressors</Text>
            <ScrollView style={styles.scrollView}>
              {stressorsOptions.map((option) => (
                <Checkbox.Item
                  key={option.value}
                  label={option.label}
                  status={stressors.includes(option.value) ? 'checked' : 'unchecked'}
                  onPress={() => toggleStressors(option.value)}
                />
              ))}
            </ScrollView>
            <Button mode="contained" onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
              Done
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingTop: 150, // Added paddingTop to move content down
  },
  header: {
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginLeft: 20,
    color: '#888',
    marginBottom: 20, // Increased marginBottom for more space
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    height: 100,
    alignSelf: 'center',
    marginBottom: 30, // Increased marginBottom for more space
    padding: 10,
    textAlign: 'left',
  },
  dropdown: {
    height: 40,
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    paddingLeft: 10,
    borderColor: 'grey', // Ensure consistent border color
    borderWidth: 1,
    marginBottom: 30, // Increased marginBottom for more space
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 0,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30, // Increased marginTop for more space
  },
  button: {
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
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalButton: {
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
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen1;
