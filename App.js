// import React, { useState } from 'react';
import React, { useState, createContext, useContext } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ChooseGoalsScreen from './components/ChooseGoals';
import NewLandingScreen from './components/LandingScreen';
import JournalScreen from './components/JournalScreen';
import JournalSummary from './components/JournalSummary';
import ChatScreen from './components/ChatScreen';
import CustomizeScreen from './components/CustomizeScreen';
import DataScreen from './components/DataScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import ChooseYourBuddy from './components/ChooseBuddy';
import LogInScreen from './components/LogInScreen';
import CreateAccountScreen from './components/CreateAccount';
import ViewPastEntries from './components/ViewPastEntries';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { COLORS} from './styles/globalStyles';
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

function OnboardingStackNavigator({ setOnboardingComplete }) {
  return (
    <OnboardingStack.Navigator
      initialRouteName="LandingScreen"
      screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
    >
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
  let contentDisplayed;
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
              return <Ionicons name={iconName} size={32} color={COLORS.mindstormLightGrey} />;
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
          <Tab.Screen name="Insights" component={DataStackNavigator} options={{ headerShown: false }} />
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
