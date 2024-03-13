import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalFonts } from '../styles/globalFonts';
import { ExtractEntriesFromSpecificDayFirebase, testUser } from '../firebase/functions';

export default function ViewPastEntries() {
  const navigation = useNavigation();
  const route = useRoute();
  const fontsLoaded = useGlobalFonts();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const selectedDate = route.params?.selectedDate;
      if (selectedDate) {
        const entriesData = await ExtractEntriesFromSpecificDayFirebase(testUser, selectedDate);
        setEntries(entriesData);
        console.log('Entries from the specific day:', entriesData);
      }
    };

    fetchEntries();
  }, [route.params?.selectedDate]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={IMAGES.gradientbg} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightGrey} size={48} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>View Past Entries</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <View key={index} style={styles.entryContainer}>
                  <Text style={styles.entryText}>{entry.text}</Text>
                  <Text style={styles.entryTime}>{entry.time.toLocaleString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noEntriesText}>No entries found for this day.</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    color: COLORS.mindstormGrey,
    fontSize: 22,
    marginBottom: 16,
    fontFamily: "Inter-Medium",
    textAlign: 'center',
  },
  noEntriesText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: COLORS.mindstormGrey,
    textAlign: 'center',
  },
  entryContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 8,
  },
  entryText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: COLORS.mindstormGrey,
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: COLORS.mindstormGrey,
    textAlign: 'right',
  },
});