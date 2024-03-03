import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCnxlsHzqhmmko_2BbEqrLYmqrShwrrfEM",
    authDomain: "mindstorm-journal.firebaseapp.com",
    projectId: "mindstorm-journal",
    storageBucket: "mindstorm-journal.appspot.com",
    messagingSenderId: "641041331910",
    appId: "1:641041331910:web:02d889f130b303c96109c7",
    measurementId: "G-5Y2R1H6F13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

// const analytics = getAnalytics(app);
export default app;
