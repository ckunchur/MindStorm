import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import ChooseGoalsScreen from './components/ChooseGoals';
import NewLandingScreen from './components/LandingScreen';
import JournalScreen from './components/JournalScreen';
import JournalSummary from './components/JournalSummary';
import ChatScreen from './components/ChatScreen';
import CustomizeScreen from './components/CustomizeScreen';
import EmotionIsland from './components/EmotionIsland';
import DataScreen from './components/DataScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import Affirmations from './components/Affirmations';
import TopicRecap from './components/TopicRecap';
import ChooseYourBuddy from './components/ChooseBuddy';
import LogInScreen from './components/LogInScreen';
import CreateAccountScreen from './components/CreateAccount';
import ViewPastEntries from './components/ViewPastEntries';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { COLORS } from './styles/globalStyles';
import { UserProvider } from './contexts/UserContext'; // Adjust the path as needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import OnboardingUnwind from './components/Onboarding_Unwind';
import OnboardingLastScreen from './components/OnboardingLastScreen';
import OnboardingScreen1 from './components/OnboardingScreen1';
import OnboardingScreen2 from './components/OnboardingScreen2';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import EditGoalScreen from './components/EditGoals'; // Import the EditGoalScreen component

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const Tab = createBottomTabNavigator();
const OnboardingStack = createStackNavigator();
const ChatStack = createStackNavigator();
const JournalStack = createStackNavigator();
const DataStack = createStackNavigator();
const IslandStack = createStackNavigator();
const AffirmationsStack = createStackNavigator();
const MainStack = createStackNavigator(); // Add this line

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
    <ChatStack.Navigator initialRouteName="ChatScreen" screenOptions={{ headerShown: false }}>
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

function IslandStackNavigator() {
  return (
    <IslandStack.Navigator initialRouteName="EmotionIsland" screenOptions={{ headerShown: false }}>
      <IslandStack.Screen name="EmotionIsland" component={EmotionIsland} />
      <IslandStack.Screen name="TopicRecap" component={TopicRecap} />
      <IslandStack.Screen name="Affirmations" component={Affirmations} />
      <IslandStack.Screen name="ChatScreen" component={ChatScreen} />
    </IslandStack.Navigator>
  );
}

function AffirmationsStackNavigator() {
  return (
    <AffirmationsStack.Navigator initialRouteName="Affirmations" screenOptions={{ headerShown: false }}>
      <AffirmationsStack.Screen name="Affirmations" component={Affirmations} />
    </AffirmationsStack.Navigator>
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
      <OnboardingStack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <OnboardingStack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
      <OnboardingStack.Screen name="OnboardingScreen4" component={OnboardingUnwind} />
      <OnboardingStack.Screen name="OnboardingScreen3">
        {(props) => <OnboardingLastScreen {...props} setOnboardingComplete={setOnboardingComplete} />}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'EmotionIsland') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Affirmations') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          }
          return <Ionicons name={iconName} size={32} color={"black"} />;
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
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="EmotionIsland" component={IslandStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Affirmations" component={AffirmationsStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function MainStackNavigator() { // Add this function
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen name="EditGoalScreen" component={EditGoalScreen} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null); // Change to null to indicate loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (isUserLoggedIn === null) {
      return null; // Add a loading spinner or screen here if needed
    } else if (!isUserLoggedIn) {
      return <OnboardingStackNavigator setOnboardingComplete={() => setIsUserLoggedIn(true)} />;
    } else {
      return <MainStackNavigator />; // Use MainStackNavigator
    }
  };

  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          {renderContent()}
        </NavigationContainer>
      </PaperProvider>
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