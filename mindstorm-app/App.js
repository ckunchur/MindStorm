import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/LandingScreen';
import JournalScreen from './components/JournalScreen';
import ChatScreen from './components/ChatScreen';
import ChooseYourBuddy from './components/ChooseBuddy';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

// Stack Navigator for the Chat tab
function ChatStackNavigator() {
  return (
    <ChatStack.Navigator initialRouteName="ChooseYourBuddy" screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChooseYourBuddy" component={ChooseYourBuddy} />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
    </ChatStack.Navigator>
  );
}

export default function App() {
  const [pressed, setPressed] = useState(false);
  let contentDisplayed;

  if (pressed) {
    contentDisplayed = (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Chat') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Journal') {
                iconName = focused ? 'pencil' : 'pencil-outline';
              } else if (route.name === 'Insights') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="Journal" component={JournalScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Insights" component={ChooseYourBuddy} options={{ headerShown: false }} />
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
