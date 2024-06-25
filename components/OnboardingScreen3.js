import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OnboardingScreen3 = ({ navigation }) => {
  const [about, setAbout] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>And finally, this is a space to tell us about yourself freely.</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="I'd love to get to know you better. Share anything that you feel is important for me to understand about you, your interests, and your goals. The more details you provide, the better I can support you."
        value={about}
        onChangeText={setAbout}
        multiline={true}
      />
      <Button title="Finish" onPress={() => alert('Onboarding Complete!')} />
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

export default OnboardingScreen3;
