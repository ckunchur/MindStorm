import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, ProgressBar, Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {ChatScreen} from './ChatScreen'; // Import the ChatScreen component
import profileImage from '../assets/profilepic.png'; // Adjust the path to your profile image

const Dashboard = ({ navigation }) => {
  const [userName, setUserName] = useState("Caitlin");
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
  const [goals, setGoals] = useState([
    { title: "Work on mindstorm", progress: 0.7 },
    { title: "Read 20 Books", progress: 0.4 },
    { title: "Exercise Regularly", progress: 0.6 }
  ]);
  const [coachMessage, setCoachMessage] = useState("Embrace the power of small wins today. Each task you complete, no matter how minor, is a step towards your larger goals. Stay focused, be kind to yourself, and remember that progress, not perfection, is the key to lasting growth. You've got this!");

  const renderGoal = (goal, index) => (
    <Card key={index} style={styles.goalCard}>
      <Card.Title title={goal.title} />
      <Card.Content>
        <ProgressBar progress={goal.progress} style={styles.progressBar} color="#000" />
        <LinearGradient
          colors={['#78bbcb', '#5c8bb2']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.updateButtonGradient}
        >
          <Button mode="contained" style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Start goal chat</Text>
          </Button>
        </LinearGradient>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, {userName}! 👋</Text>
          <Text style={styles.subGreetingText}>Let's conquer your day.</Text>
        </View>
        <Avatar.Image size={48} source={profileImage} style={styles.profilePicture} />
      </View>
      <View style={styles.checkInContainer}>
        <View style={styles.checkInTextContainer}>
          <View style={styles.checkInTextWrapper}>
            <Text style={styles.checkInText}>Ready to check in? 🙃</Text>
            <Text style={styles.checkInSubText}>Let's hear how your day is going so far.</Text>
          </View>
        </View>
        <LinearGradient
          colors={['#78bbcb', '#5c8bb2']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.arrowButtonGradient}
        >
          <Button mode="contained" style={styles.arrowButton} onPress={() => navigation.navigate('ChatScreen')}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </Button>
        </LinearGradient>
      </View>
      <View style={styles.goalsHeaderContainer}>
        <Text style={styles.sectionTitle}>Current Goals</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditGoalScreen')}>
          <Text style={styles.editLink}>edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.goalsSubheader}>Want to check in on a specific goal? Start a goal-oriented chat.</Text>
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
    marginTop: 100,
    marginLeft: 20,
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 18,
    color: '#666',
  },
  profilePicture: {
    marginLeft: 50,
    marginRight: 30,
  },
  checkInContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingLeft: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginRight: 20,
  },
  checkInTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkInTextWrapper: {
    marginLeft: 0,
    flex: 1,
  },
  checkInText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkInSubText: {
    fontSize: 16,
    color: '#666',
  },
  arrowButtonGradient: {
    borderRadius: 24,
    padding: 5,
    marginRight: 20, // Added right margin to create space from the edge
  },
  arrowButton: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 5,
  },
  goalsHeaderContainer: {
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editLink: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
  },
  goalsSubheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  goalsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#fefefe',
    marginRight: 16,
    marginLeft: 5,
    width: 250,
    height: 180,
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  progressBar: {
    marginTop: 12,
    marginBottom: 20, // Added bottom margin to create space
    backgroundColor: '#E0E0E0',
  },
  updateButtonGradient: {
    borderRadius: 24,
    padding: 2,
    marginTop: 10, // Added top margin to create space from the progress bar
  },
  updateButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  coachMessageContainer: {
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#fefefe',
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  coachMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  coachMessage: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 27,
  },
});

export default Dashboard;
