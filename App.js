// import React, { useState } from 'react';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ChatScreen from './components/ChatScreen'
// import ChooseGoalsScreen from './components/old/ChooseGoals';
// import JournalScreen from './components/old/JournalScreen';
// import JournalSummary from './components/old/JournalSummary';
// import ChatScreen from './components/old/ChatScreen';
// import CustomizeScreen from './components/old/CustomizeScreen';
// import DataScreen from './components/old/DataScreen';
// import PersonalInfoScreen from './components/PersonalInfoScreen';
// import ChooseYourBuddy from './components/old/ChooseBuddy';
// import LogInScreen from './components/old/LogInScreen';
// import CreateAccountScreen from './components/old/CreateAccount';
// import ViewPastEntries from './components/ViewPastEntries';
import OnboardingScreen1 from './components/OnboardingScreen1';
import OnboardingScreen2 from './components/OnboardingScreen2';
import OnboardingScreen3 from './components/OnboardingLastScreen';
import OnboardingScreen4 from './components/Onboarding_Unwind';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { COLORS } from './styles/globalStyles';
import { UserProvider } from './contexts/UserContext'; // Adjust the path as needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


const Tab = createBottomTabNavigator();
const OnboardingStack = createStackNavigator();
const ChatStack = createStackNavigator();
const JournalStack = createStackNavigator();
const DataStack = createStackNavigator();

function DataStackNavigator() {
  return (
    <DataStack.Navigator initialRouteName="DataScreen" screenOptions={{ headerShown: false }}>
      <DataStack.Screen name="DataScreen" component={DataScreen} />
      <DataStack.Screen name="ViewPastEntries" component={ViewPastEntries} />
      {/* <DataStack.Screen name="LandingScreen" component={NewLandingScreen} /> */}

    </DataStack.Navigator>
  );
}

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

// function OnboardingStackNavigator({ setOnboardingComplete }) {
//   return (
//     <OnboardingStack.Navigator
//       initialRouteName="LandingScreen"
//       screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
//     >
//       <OnboardingStack.Screen name="LandingScreen" component={NewLandingScreen} />
//       <OnboardingStack.Screen name="LogInScreen">
//         {(props) => <LogInScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
//       </OnboardingStack.Screen>
//       <OnboardingStack.Screen name="CreateAccount" component={CreateAccountScreen} />
//       <OnboardingStack.Screen name="ChooseGoals" component={ChooseGoalsScreen} />
//       <OnboardingStack.Screen name="PersonalInfo">
//         {(props) => <PersonalInfoScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
//       </OnboardingStack.Screen>
//     </OnboardingStack.Navigator>
//   );
// }

function OnboardingStackNavigator({ setOnboardingComplete }) {
  return (
    <OnboardingStack.Navigator
      initialRouteName="OnboardingScreen1" 
      screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
    >
      <OnboardingStack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <OnboardingStack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
      <OnboardingStack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
      <OnboardingStack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
      <OnboardingStack.Screen name="ChatScreen" component={ChatScreen} />
      {/* 
      <OnboardingStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <OnboardingStack.Screen name="ChooseGoals" component={ChooseGoalsScreen} />
      <OnboardingStack.Screen name="PersonalInfo">
        {(props) => <PersonalInfoScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
      </OnboardingStack.Screen>
      */}
    </OnboardingStack.Navigator>
  );
}

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (isUserLoggedIn === null) {
      return null; 
    } else if (isUserLoggedIn) {
      return (
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
              return <Ionicons name={iconName} size={32} color={COLORS.mindstormLightGrey} />;
            },
          })}
          tabBarOptions={{
            showLabel: false,
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
          <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="Insights" component={DataStackNavigator} options={{ headerShown: false }} />
        </Tab.Navigator>
      );
    } else {
      // Onboarding flow for users who are not logged in
      return <OnboardingStackNavigator setOnboardingComplete={setIsUserLoggedIn} />;
    }
  };

  return (
    <UserProvider>
      <NavigationContainer>
        {renderContent()}
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
