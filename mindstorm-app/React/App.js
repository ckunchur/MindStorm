// import React, { useState } from 'react';
import React, { useState, createContext, useContext } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import LandingScreen from './components/LandingScreen';
import ChooseGoalsScreen from './components/ChooseGoals';
import NewLandingScreen from './components/NewLanding';
import JournalScreen from './components/NewJournalScreen';
import JournalSummary from './components/JournalSummary';
import ChatScreen from './components/ChatScreen';
import CustomizeScreen from './components/CustomizeScreen';
import HomeScreen from './components/HomeScreen';
import DataScreen from './components/DataScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import ChooseYourBuddy from './components/ChooseBuddy';
import LogInScreen from './components/LogInScreen';
import CreateAccountScreen from './components/CreateAccount';
// import OnboardingContext from './contexts/OnboardingContext'; // Adjust the path as necessary


import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


const Tab = createBottomTabNavigator();
const OnboardingStack = createStackNavigator();
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
      <JournalStack.Screen name="ChatScreen" component={ChatScreen} />
    </JournalStack.Navigator>
  );
}


// function HomeStackNavigator() {
//   return (
//     <HomeStack.Navigator initialRouteName="LandingScreen" screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="LandingScreen" component={NewLandingScreen} />
//       <HomeStack.Screen name="LogInScreen" component={LogInScreen} />
//       <HomeStack.Screen name="JournalScreen" component={JournalScreen} />
//       <HomeStack.Screen name="ChooseYourBuddy" component={ChooseYourBuddy} />

//     </HomeStack.Navigator>
//   );
// }

function OnboardingStackNavigator({ setOnboardingComplete }) {
  return (
    <OnboardingStack.Navigator initialRouteName="LandingScreen" screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="LandingScreen" component={NewLandingScreen} />
      <OnboardingStack.Screen name="LogInScreen">
      {(props) => <LogInScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <OnboardingStack.Screen name="ChooseGoals" component={ChooseGoalsScreen} />
      <OnboardingStack.Screen name="PersonalInfo">
        {(props) => <PersonalInfoScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
}

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const size = 25;
  let contentDisplayed;
  // <OnboardingContext.Provider value={{ setOnboardingComplete: setOnboardingComplete }}>
  // {onboardingComplete ? (

  if (onboardingComplete) {
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
          <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false, tabBarVisible: false, }} />
          <Tab.Screen name="Insights" component={DataScreen} options={{ headerShown: false }} />
        </Tab.Navigator>

      </NavigationContainer>
    );
  }
  else {
    contentDisplayed = (
      <NavigationContainer>
        <OnboardingStackNavigator setOnboardingComplete={setOnboardingComplete} />
        </NavigationContainer>
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
