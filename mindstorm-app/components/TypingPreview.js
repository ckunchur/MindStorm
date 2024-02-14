import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TypingPreviewBox = ({ text, onChangeText, onClose, onSend, loading }) => {
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#007bff" />
        </TouchableOpacity>
        <TextInput
          style={styles.previewText}
          value={text}
          onChangeText={onChangeText}
          placeholder='Start typing...'
          multiline={true}
        />
      </ScrollView>
      <TouchableOpacity onPress={onSend} style={styles.sendButton}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.sendButtonText}>Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: '50%',
   
    transform: [{ translateX: -windowWidth * 0.35 }, { translateY: -windowHeight * 0.175 }],
    width: windowWidth * 0.7,
    height: windowHeight * 0.35,
    zIndex: 100,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 10,
  },
  previewText: {
    fontSize: 16,
    flex: 1,
    paddingTop: 20, // Top padding to push text below close button
    paddingRight: 30, // Right padding to prevent text overlap with close button
    paddingBottom: 20, // Bottom padding to push text above send button
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    position: 'absolute',
    right: 30,
    bottom: 30, // Adjust bottom as needed to place the send button at the desired location
  },
  sendButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 101, // Make sure the zIndex is higher than the text so it appears on top
  },
});

export default TypingPreviewBox;
