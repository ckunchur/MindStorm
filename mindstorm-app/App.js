import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from "react";
import LandingScreen from './components/LandingScreen';
import JournalScreen from './components/JournalScreen';
import { Ionicons } from '@expo/vector-icons';
import ChooseYourBuddy from './components/ChooseBuddy';

const Tab = createBottomTabNavigator();


export default function App() {
  let contentDisplayed; // set equal to list component if true
  const [pressed, setPressed] = useState(false)

  if (pressed) {
    contentDisplayed = (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabelStyle: {
            labelStyle: { fontSize: 14 }
          },
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Insights') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } 
            else if (route.name === 'Journal') {
              iconName = focused ? 'pencil' : 'pencil-outline';
            } 
            return <Ionicons name={iconName} size={24} color="black" />;
          }
        })}>
        <Tab.Screen name="Chat" options={{headerShown: false}}  component={ChooseYourBuddy} />
        <Tab.Screen name="Journal" options={{headerShown: false}} component={JournalScreen} />
        <Tab.Screen name="Insights" options={{headerShown: false}} component={ChooseYourBuddy} />

      </Tab.Navigator>
     
  </NavigationContainer>
    )

  }
  else { 
    contentDisplayed = (
    <SafeAreaView style={styles.container}> 
      <LandingScreen setPressed={setPressed}/>
    </SafeAreaView> 
    )
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