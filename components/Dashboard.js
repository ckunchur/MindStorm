import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, ProgressBar, Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  const [userName, setUserName] = useState("John Doe");
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
  const [goals, setGoals] = useState([
    { title: "Meditate Daily", progress: 0.7 },
    { title: "Read 20 Books", progress: 0.4 },
    { title: "Exercise Regularly", progress: 0.6 }
  ]);
  const [coachMessage, setCoachMessage] = useState("Embrace the power of small wins today. Each task you complete, no matter how minor, is a step towards your larger goals. Stay focused, be kind to yourself, and remember that progress, not perfection, is the key to lasting growth. You've got this!");

  const renderGoal = (goal, index) => (
    <Card key={index} style={styles.goalCard}>
      <Card.Title title={goal.title} />
      <Card.Content>
        <ProgressBar progress={goal.progress} style={styles.progressBar} />
        <Button mode="contained" style={styles.updateButton}>Start goal chat</Button>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, {userName}</Text>
          <Text style={styles.subGreetingText}>Welcome back!</Text>
        </View>
        <Avatar.Image size={48} source={{ uri: profilePicture }} style={styles.profilePicture} />
      </View>
      <View style={styles.checkInContainer}>
        <View style={styles.checkInTextContainer}>
          {/* <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" /> */}
          <View style={styles.checkInTextWrapper}>
            <Text style={styles.checkInText}>Ready to check in? 🙃</Text>
            <Text style={styles.checkInSubText}>Let's hear how your day is going so far.</Text>
          </View>
        </View>
        <Button mode="contained" style={styles.arrowButton} onPress={() => navigation.navigate('ChatScreen')}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </Button>
      </View>
      <Text style={styles.sectionTitle}>Current Goals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsContainer}>
        {goals.map(renderGoal)}
      </ScrollView>
      <View style={styles.coachMessageContainer}>
        <Text style={styles.coachMessageTitle}>Today's message from your growth coach 💪:</Text>
        <Text style={styles.coachMessage}>{coachMessage}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100, // Increased top padding
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Increased bottom margin
  },
  greetingText: {
    fontSize: 28, // Increased font size
    fontWeight: 'bold',
    marginBottom: 4, // Added margin between greeting lines
  },
  subGreetingText: {
    fontSize: 18, // Increased font size
    color: '#666',
  },
  profilePicture: {
    marginLeft: 50, // Increased left margin
    marginRight: 10,
  },
  checkInContainer: {
    marginTop: 10, // Increased top margin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20, // Increased vertical padding
    paddingHorizontal: 10, // Increased horizontal padding
    paddingLeft: 20,
    borderRadius: 12, // Increased border radius
    marginBottom: 24, // Increased bottom margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  checkInTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Added flex to allow text to wrap
  },
  checkInTextWrapper: {
    marginLeft: 0, // Increased left margin
    flex: 1, // Added flex to allow text to wrap
  },
  checkInText: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    marginBottom: 8, // Added margin between text lines
  },
  checkInSubText: {
    fontSize: 16, // Increased font size
    color: '#666',
  },
  arrowButton: {
    backgroundColor: '#000',
    borderRadius: 24, // Increased border radius
    padding: 5, // Increased padding
    marginLeft: 16, // Added left margin to separate from text
    marginRight: 10,
  },
  sectionTitle: {
    marginTop: 24, // Increased top margin
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    marginBottom: 16, // Decreased bottom margin
  },
  goalsContainer: {
    flexDirection: 'row',
    marginBottom: 24, // Increased bottom margin
  },
  goalCard: {
    backgroundColor: '#f5f5f5',
    marginRight: 16,
    marginLeft: 5,
    width: 250,
    height: 180, // Adjusted height
    borderRadius: 12, // Increased border radius
    marginVertical: 8, // Added vertical margin to prevent cut-off
  },
  progressBar: {
    marginTop: 12, // Increased top margin
    marginBottom: 40, // Increased bottom margin
  },
  updateButton: {
    alignSelf: 'flex-start',
  },
  coachMessageContainer: {
    marginTop: 0,
    padding: 5, // Increased padding
    backgroundColor: '#f4f4f4',
    borderRadius: 12, // Increased border radius
  },
  coachMessageTitle: {
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    marginBottom: 12, // Increased bottom margin
  },
  coachMessage: {
    marginTop: 0,
    fontSize: 18, // Increased font size
    lineHeight: 24, // Added line height for better readability
  },
});

export default Dashboard;