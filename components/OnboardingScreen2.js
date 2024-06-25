import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OnboardingScreen2 = ({ navigation }) => {
  const [stressors, setStressors] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are your main stressors/sources of unhappiness?</Text>
      <TextInput
        style={styles.input}
        placeholder="I'm under a lot of pressure because my manager..."
        value={stressors}
        onChangeText={setStressors}
      />
      <Button title="Next" onPress={() => navigation.navigate('OnboardingScreen3')} />
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
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
});

export default OnboardingScreen2;
