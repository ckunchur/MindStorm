import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/LandingScreen';
import JournalScreen from './components/JournalScreen';
import JournalSummary from './components/JournalSummary';
import ChatScreen from './components/ChatScreen';
import CustomizeScreen from './components/CustomizeScreen';
import HomeScreen from './components/HomeScreen';
import DataScreen from './components/DataScreen';

import ChooseYourBuddy from './components/ChooseBuddy';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();
const JournalStack = createStackNavigator();
const HomeStack = createStackNavigator();


// Stack Navigator for the Chat tab
function ChatStackNavigator() {
  return (
    <ChatStack.Navigator initialRouteName="ChooseYourBuddy" screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChooseYourBuddy" component={ChooseYourBuddy} />
      <ChatStack.Screen name="CustomizeScreen" component={CustomizeScreen} />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />

    </ChatStack.Navigator>
  );
}

function JournalStackNavigator() {
  return (
    <JournalStack.Navigator initialRouteName="JournalScreen" screenOptions={{ headerShown: false }}>
      <JournalStack.Screen name="JournalScreen" component={JournalScreen} />
      <JournalStack.Screen name="JournalSummary" component={JournalSummary} />
    </JournalStack.Navigator>
  );
}


function HomeStackNavigator() {
  return (
    <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="JournalScreen" component={JournalScreen} />
      <ChatStack.Screen name="ChooseYourBuddy" component={ChooseYourBuddy} />

    </HomeStack.Navigator>
  );
}

export default function App() {
  const [pressed, setPressed] = useState(false);
  const size = 25;
  let contentDisplayed;

  if (pressed) {
    contentDisplayed = (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size }) => {
              let iconName;
              if (route.name === 'Chat') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Journal') {
                iconName = focused ? 'journal' : 'journal-outline';
              } else if (route.name === 'Insights') {
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              }
              if (route.name === 'Chat') {
                return <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 35,
                  backgroundColor: 'white', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 30, 
                }}>
                  <Ionicons name={iconName} size={44} color="#4A9BB4" />
                </View>
              }
              return <Ionicons name={iconName} size={32} color="#4A9BB4" />;
            },
          })}
          tabBarOptions={{
            showLabel: false, // Hide the tab labels
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              backgroundColor: '#ffffff', 
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20, 
              height: 60, 
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowColor: '#000',
              shadowOffset: { height: -5, width: 0 },
            },
          }}
        >
          <Tab.Screen name="Journal" component={JournalStackNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false,  tabBarVisible: false,}} />
          <Tab.Screen name="Insights" component={DataScreen} options={{ headerShown: false }} />
        </Tab.Navigator>

      </NavigationContainer>
    );
  } else {
    contentDisplayed = (
      <SafeAreaView style={styles.container}>
        <LandingScreen setPressed={setPressed} />
      </SafeAreaView>
    );
  }

  return contentDisplayed;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
