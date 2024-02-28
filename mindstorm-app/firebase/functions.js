import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, getDocs, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Alert } from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  updateEmail,
  updatePassword,
} from 'firebase/auth';



export const signInUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed in: ", user.uid);

    return true; // Indicate success
  } catch (error) {
    console.error("Error signing in: ", error.message);
    
    throw error; // Re-throw the error for handling by the caller
  }
};

export const signUpUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
    });

    console.log("User created with name: ", user.displayName);
    return true; // Indicate success
  } catch (error) {
    console.error("Error signing up: ", error.message);
    
    throw error;
  }
};
export const writeBotSettingsToFirebase = async (userId, bot, memory, tone, age, gender) => {
    try {
        // Construct the document path
        const botSettingsDocRef = doc(db, `users/${userId}/botSettings/${bot}`);
        
        // Set the document with the provided settings
        await setDoc(botSettingsDocRef, {
            memory: memory,
            tone: tone,
            age: age,
            gender: gender
        }, { merge: true }); // Using merge: true to update the document without overwriting existing fields
        
        console.log("Document successfully written!");
    } catch (e) {
        console.error("Error writing document: ", e);
    }
};

export const writeChatHistoryToFirebase = async (userId, history) => {
    try {
        // Ensure the collection path is correctly constructed
        const chatsCollectionRef = collection(db, `users/${userId}/chats`);
        const docRef = await addDoc(chatsCollectionRef, {
            chatHistory: history,
            timestamp: new Date() // Adds a timestamp
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const ExtractEntriesFromFirebase = (userId) => {
  const [entryList, setEntryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEntries = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const entriesRef = collection(userRef, 'entries');
          const entriesSnapshot = await getDocs(entriesRef);

          const entries = entriesSnapshot.docs.map((entryDoc) => ({
            ...entryDoc.data(),
          }));

          setEntryList(entries);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching entries', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) getEntries();
  }, [userId]);

  return { entryList, loading };
};
