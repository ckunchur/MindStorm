// ViewPastEntries.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView,TouchableOpacity} from 'react-native';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ViewPastEntries() {
    const navigation = useNavigation();  
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightGrey} size={48} />
                </TouchableOpacity>
            <Text style={styles.text}>View Past Entries</Text>
            {/* Your content goes here */}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 10
    },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
