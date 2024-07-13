import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

const EditGoalScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([
    { title: "Meditate Daily", description: "", date: new Date() },
    { title: "Read 20 Books", description: "", date: new Date() },
    { title: "Exercise Regularly", description: "", date: new Date() }
  ]);

  const [recentWins, setRecentWins] = useState([
    { description: "Last week, you got three workouts in.", date: '2024-07-01' },
    { description: "You made time to work on your app, despite being exhausted after work.", date: '2024-06-15' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalDate, setNewGoalDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addGoal = () => {
    setGoals([...goals, { title: newGoalTitle, description: newGoalDescription, date: newGoalDate }]);
    setModalVisible(false);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalDate(new Date());
  };

  const deleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const getMotivationalMessage = () => {
    let message = "";
    if (recentWins.length > 0) {
      message += recentWins.map(win => win.description).join(' ');
      message += " Remember to take a moment to feel proud of these accomplishments. Each one represents progress towards your larger goals. Keep this momentum going, but also remember to rest and recharge when needed. Great job this week!";
    } else {
      message += "Remember to take a moment to feel proud of these accomplishments. Each one represents progress towards your larger goals. Keep this momentum going, but also remember to rest and recharge when needed. Great job this week!";

    }
    return message;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review and Edit Your Goals</Text>
        </View>

        {goals.map((goal, index) => (
          <Card key={index} style={styles.goalCard}>
            <Card.Title title={goal.title} />
            <Card.Content>
              <Text>{goal.description}</Text>
              <Text>{moment(goal.date).format('MMMM Do, YYYY')}</Text>
            </Card.Content>
            <TouchableOpacity onPress={() => deleteGoal(index)} style={styles.deleteIcon}>
              <Ionicons name="trash" size={24} color="black" />
            </TouchableOpacity>
          </Card>
        ))}

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={['#78bbcb', '#5c8bb2']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Add Goal</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Wins 🏆</Text>

        {recentWins.map((win, index) => (
          <Card key={index} style={styles.winCard}>
            <Card.Content>
              <Text>{win.description}</Text>
              <Text>{moment(win.date).format('MMMM Do, YYYY')}</Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Celebrating your wins! 🚀</Text>
        <Card style={styles.motivationalMessageCard}>
          <Card.Content>
            <Text style={styles.motivationalMessage}>{getMotivationalMessage()}</Text>
          </Card.Content>
        </Card>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter goal title"
              maxLength={50}
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your goal (optional)"
              maxLength={200}
              multiline
              numberOfLines={4}
              value={newGoalDescription}
              onChangeText={setNewGoalDescription}
            />
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Target Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{moment(newGoalDate).format('MMMM Do, YYYY')}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={newGoalDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setNewGoalDate(date);
                    }
                  }}
                />
              )}
            </View>
            <Button mode="contained" onPress={addGoal} style={styles.modalButton}>
              Save Goal
            </Button>
            <Button mode="text" onPress={() => setModalVisible(false)} style={styles.modalButton}>
              Cancel
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    marginLeft: 20,
    marginRight: 20,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  goalCard: {
    backgroundColor: '#fefefe',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  deleteIcon: {
    position: 'absolute',
    right: 16,
    top: 25,
    bottom: 16,
  },
  addButtonGradient: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  winCard: {
    backgroundColor: '#fefefe',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  motivationalMessageCard: {
    backgroundColor: '#fefefe',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  motivationalMessage: {
    fontSize: 16,
    color: '#666',
  },
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: 'blue',
  },
  modalButton: {
    marginTop: 8,
  },
});

export default EditGoalScreen;
