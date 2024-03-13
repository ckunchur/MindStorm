import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DonutChart from './DonutChart';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { testUser, ExtractUserNameFromFirebase, ExtractLastWeekEntriesFirebase, ExtractLatestWeeklyAnalysisFromFirebase } from '../firebase/functions';
import { weeklongSummaryWithChatGPT, weeklongTopicClassificationWithChatGPT, weeklongMoodClassificationWithChatGPT } from '../OpenAI/OpenAI';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES} from '../styles/globalStyles';

const colors = ['#d7a8ff', '#ffdbe8', '#99a6f7', '#ffdbfb', '#dbfffd'];

const ChartRow = ({ title, sections }) => {
  return (
    <View style={styles.chartRowContainer}>
      <DonutChart
        size={160}
        strokeWidth={25}
        sections={sections.map((item, index) => ({
          ...item,
          color: colors[index % colors.length],
        }))}
      />

      <ScrollView vertical showsHorizontalScrollIndicator={false}>
        <Text style={styles.chipsHeading}>{title}</Text>
        <View style={styles.chipsContainer}>
          {sections.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, { backgroundColor: colors[index % colors.length] }]}
            >
              <Text style={styles.chipText}>{item.label} ({item.percentage}%)</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const weather_moods = {
  "Stormy": require("../assets/stormy-mood.png"),
  "Rainy": require("../assets/rainy-mood.png"),
  "Cloudy": require("../assets/cloudy-mood.png"),
  "Partly Cloudy": require("../assets/partial-cloudy-mood.png"),
  "Cloudy": require("../assets/cloudy-mood.png"),
  "Sunny": require("../assets/sunny-mood.png"),
}

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

const MoodImage = ({ mood, date, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.moodWeatherView}>
        <Image
          source={weather_moods[mood]}
          style={[styles.moodImage, { tintColor: COLORS.mindstormGrey }]}
          resizeMode="contain"
        ></Image>
        <Text style={styles.moodWeatherText}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function DataScreen() {
  const navigation = useNavigation();
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) {
    return null;
  }    

  const [userName, setUserName] = useState('');
  const [weeklongSummary, setWeeklongSummary] = useState("");
  const [weeklongTopics, setWeeklongTopics] = useState([]);
  const [weeklongMoods, setWeeklongMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const performWeeklongAnalysis = async (uid) => {
    console.log("Performing weeklong analysis for user ID:", uid);
    const fetchedEntries = await ExtractLastWeekEntriesFirebase(uid);
    if (fetchedEntries.length > 0) {
      try {
        const results = await Promise.all([
          weeklongSummaryWithChatGPT(JSON.stringify(fetchedEntries)),
          weeklongTopicClassificationWithChatGPT(JSON.stringify(fetchedEntries)),
          weeklongMoodClassificationWithChatGPT(JSON.stringify(fetchedEntries)),
        ]);
        const [
          weeklongSummaryWithResult,
          weeklongTopicClassificationResult,
          weeklongMoodClassificationResult,
        ] = results;

        // Extract the JSON string from the topic classification response
        const topicJsonString = weeklongTopicClassificationResult.data.match(/```json\s*([\s\S]*?)\s*```/)[1];
        const sanitizedTopicJsonString = topicJsonString.replace(/\\"/g, '"');
        const parsedTopicData = JSON.parse(sanitizedTopicJsonString);

        // Extract the JSON string from the mood classification response
        const moodJsonString = weeklongMoodClassificationResult.data.match(/```json\s*([\s\S]*?)\s*```/)[1];
        const sanitizedMoodJsonString = moodJsonString.replace(/\\"/g, '"');
        const parsedMoodData = JSON.parse(sanitizedMoodJsonString);

        // Firebase: Create a new entry in the "weeklyAnalysis" collection for the user
        const weeklyAnalysisRef = collection(db, `users/${uid}/weeklyAnalysis`);
        await addDoc(weeklyAnalysisRef, {
          weeklongSummary: weeklongSummaryWithResult.data,
          weeklongTopics: parsedTopicData,
          weeklongMoods: parsedMoodData,
          timeStamp: serverTimestamp(),
        });

        // Update the state with the latest weekly analysis data
        setWeeklongSummary(weeklongSummaryWithResult.data);
        setWeeklongTopics(parsedTopicData);
        setWeeklongMoods(parsedMoodData);
      } catch (error) {
        console.error('Error during weekly analysis:', error);
      }
    } else {
      console.log("No entries found for weeklong analysis");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for user ID:", testUser);
      
      // Fetch user name
      const fetchedUserName = await ExtractUserNameFromFirebase(testUser);
      if (fetchedUserName) {
        setUserName(fetchedUserName);
        console.log("User's name:", fetchedUserName);
      } else {
        console.log("UserName not found or error fetching userName");
      }

      // Fetch the last weekly analysis from Firebase
      const weeklyAnalysisRef = collection(db, `users/${testUser}/weeklyAnalysis`);
      const q = query(weeklyAnalysisRef, orderBy("timeStamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastWeeklyAnalysis = querySnapshot.docs[0].data();
        const lastTimestamp = lastWeeklyAnalysis.timeStamp.toDate();
        const currentTime = new Date();
        const fourHoursAgo = new Date(currentTime.getTime() - 4 * 60 * 60 * 1000);

        if (lastTimestamp >= fourHoursAgo) {
          console.log("Using fetched weekly analysis data");
          // If the last timestamp is within the last four hours, use the fetched data
          setWeeklongSummary(lastWeeklyAnalysis.weeklongSummary);
          setWeeklongTopics(lastWeeklyAnalysis.weeklongTopics);
          setWeeklongMoods(lastWeeklyAnalysis.weeklongMoods);
        } else {
          console.log("Last weekly analysis is older than four hours, rerunning analysis");
          // If the last timestamp is older than four hours, rerun the weekly analysis
          await performWeeklongAnalysis(testUser);
        }
      } else {
        console.log("No weekly analysis data found, running analysis");
        // If no weekly analysis data is found, run the weekly analysis
        await performWeeklongAnalysis(testUser);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleViewPastEntries = (selectedDate) => {
    navigation.navigate('ViewPastEntries', { selectedDate });
  };

  return (
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormGrey} size={48} />
      </TouchableOpacity>
      <ImageBackground
        resizeMode="cover"
        source={IMAGES.gradientbg}
        style={styles.fullScreen}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <WelcomeTitle title={userName ? `Hi ${userName},` : "Your weekly summary"} style={styles.title} />
          <WelcomeMessage message="Here is a summary of your key feelings and topics over time" style={styles.subheaderText} />

          {isLoading ? (
            <Text style={styles.summarySubheading}>Loading...</Text>
          ) : (
            <>
              {/* Daily weather moods */}
              <Text style={styles.summarySubheading}>Your daily weather moods this month:</Text>
              <Text style={styles.summarySubsubheading}>Click on a day to view past entries</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moodRow}>
                  {[...Array(31)].map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - index);
                    const formattedDate = date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
                    const mood = ["Rainy", "Cloudy", "Partly Cloudy", "Sunny"][index % 4];
                    return (
                      <MoodImage
                        key={index}
                        mood={mood}
                        date={formattedDate}
                        onPress={() => handleViewPastEntries(date)}
                      />
                    );
                  })}
                </View>
              </ScrollView>

              {/* Weeklong topics */}
              {weeklongTopics.length > 0 && (
                <>
                  <Text style={styles.summarySubheading}>Your brain real estate this week:</Text>
                  <View style={styles.donutChartContainer}>
                    <ChartRow title="" sections={weeklongTopics} />
                  </View>
                </>
              )}

              {/* Weeklong moods */}
              {weeklongMoods.length > 0 && (
                <>
                  <Text style={styles.summarySubheading}>Your overall moods this week:</Text>
                  <View style={styles.donutChartContainer}>
                    <ChartRow title="" sections={weeklongMoods} />
                  </View>
                </>
              )}

              {/* Weeklong summary */}
              {weeklongSummary && (
                <>
                  <Text style={styles.summarySubheading}>Weekly Reflections</Text>
                  <View style={styles.reflections}>
                    <View style={styles.predictedTextContainer}>
                      <Text style={styles.predictedText}>{weeklongSummary}</Text>
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'blue'
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  moodWeatherView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    margin: 4,
    backgroundColor: COLORS.transcluscentWhite,
    borderRadius: 12,
  },
  moodImage: {
    width: 48,
    opacity: 0.5,
    marginBottom: 8,
  },
  moodWeatherText: {
    color: COLORS.mindstormGrey,
    fontWeight: 'bold',
    fontFamily: "Inter-Regular"
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
    marginLeft: 10,
  },
  title: {
    color: COLORS.mindstormGrey,
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "700",
    fontFamily: "Inter-Medium",
    textAlign: 'center',
  },
  forecastView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  forecasttitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.mindstormGrey
  },
  subheaderText: {
    textAlign: 'center',
    width: '80%',
    color: COLORS.mindstormGrey,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginBottom: 20,
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    width: '100%',
  },
  reflections: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    borderRadius: 24,
    backgroundColor: COLORS.transcluscentWhite,
  },
  summarySubheading: {
    fontSize: 18,
    color: COLORS.mindstormGrey,
    textAlign: 'left',
    marginTop: 3,
    marginBottom: 3,
    fontFamily: "Inter-Medium"
  },
  summarySubsubheading: {
    fontSize: 14,
    color: COLORS.mindstormGrey,
    textAlign: 'left',
    marginTop: 3,
    marginBottom: 3,
    fontFamily: "Inter-Regular"
  },
  predictedTextContainer: {
    width: '90%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    padding: 10,
    marginBottom: 20,
  },
  predictedText: {
    fontFamily: "Inter-Regular",
    textAlign: 'left',
    color: COLORS.mindstormGrey,
    fontSize: 16,
  },
  donutChartContainer: {
    alignItems: 'right',
    justifyContent: 'center',
    marginTop: 20,
    },
    chartRowContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 4,
    marginLeft: 30,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row'
    },
    chipsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    color: 'white',
    },
    chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    },
    chip: {
    backgroundColor: '#1F7D9B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    },
    chipText: {
    color: COLORS.mindstormGrey,
    textAlign: 'center',
    },
    });