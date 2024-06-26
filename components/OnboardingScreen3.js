import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const OnboardingScreen3 = ({ navigation }) => {
  const [about, setAbout] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>And finally, this is a space to tell us about yourself freely.</Text>
      <TextInput
        style={styles.input}
        placeholder="I'd love to get to know you better. Share anything that you feel is important for me to understand about you, your interests, and your goals. The more details you provide, the better I can support you."
        value={about}
        onChangeText={setAbout}
        multiline={true}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={() => alert('Onboarding Complete!')}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Finish
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  input: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 100, // Increased marginBottom for more space
    padding: 10,
    textAlign: 'left',
  },
  button: {
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
  buttonContent: {
    height: 50,
  },
});

export default OnboardingScreen3;