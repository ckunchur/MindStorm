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

export const updatePersonalInfo = async (uid, gender, age, relaxActivities, hobbies) => {
  try {
    const userDocRef = doc(db, `users`, uid);

    // Construct an object with only the fields that are not null
    let updateData = {};
    if (gender !== null) updateData.gender = gender;
    if (age !== null) updateData.age = age;
    if (relaxActivities !== null) updateData.relaxActivities = relaxActivities;
    if (hobbies !== null) updateData.hobbies = hobbies;

    // Only call setDoc if there's at least one field to update
    if (Object.keys(updateData).length > 0) {
      await setDoc(userDocRef, updateData, { merge: true });
      console.log("Personal info updated successfully.");
    } else {
      console.log("No personal info fields to update.");
    }
  } catch (error) {
    console.error("Error updating personal info: ", error);
  }
};

export const updatePersonalGoals = async (uid, goals, struggles) => {
  try {
    // Create a reference to the user's personal goals document
    const userDocRef = doc(db, `users`, uid);
    let updateData = {};
    if (goals.length > 0) updateData.goals = goals;
    if (struggles !== null) updateData.struggles = struggles;
    if (Object.keys(updateData).length > 0) {
      await setDoc(userDocRef, updateData, { merge: true });
      console.log("Personal info updated successfully.");
    } else {
      console.log("No personal info fields to update.");
    }
  } catch (error) {
    console.error("Error updating personal info: ", error);
  }
};



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

export const writeChatHistoryToFirebase = async (userId, sessionID, history) => {
  if (!sessionID) {
    console.error("Invalid sessionID");
    return;
  }
  try {
      // Reference to a specific document in the "chats" subcollection of a "users" document
      const docRef = doc(db, `users/${userId}/chats`, sessionID);

      // Set the document with the provided data, merging it into an existing document if one exists
      await setDoc(docRef, {
          chatHistory: history,
          timestamp: new Date() // Adds a timestamp
      }, { merge: true });

      console.log("Document written with ID: ", docRef.id);
  } catch (e) {
      console.error("Error adding or updating document: ", e);
  }
};

export const readChatHistoryFromFirebase = async (userId) => {
  let chatHistoryStrings = [];
  try {
    // Reference to the "chats" subcollection of a "users" document
    const chatsCollectionRef = collection(db, `users/${userId}/chats`);
    // Retrieve all documents from the subcollection
    const querySnapshot = await getDocs(chatsCollectionRef);
    // Loop through each document and format the chat history
    querySnapshot.forEach((doc) => {
      const chatHistory = doc.data().chatHistory;
      if (chatHistory) {
        // Concatenate the chat history into a single string
        const chatString = chatHistory.map(entry => `role: ${entry.role}, content: "${entry.content}"`).join('; ');
        chatHistoryStrings.push(chatString);
      }
    });
    console.log("Chat history strings: ", chatHistoryStrings);
    return chatHistoryStrings;
  } catch (e) {
    console.error("Error reading chat history from Firestore: ", e);
  }
};


export const ExtractEntriesFromFirebase = async (userId) => {
  let entriesData = []; // This will hold the formatted entries data
  try {
    // Reference to the "entries" subcollection of a "users" document
    const entriesCollectionRef = collection(db, 'users', userId, 'entries');
    // Retrieve all documents from the "entries" subcollection
    const querySnapshot = await getDocs(entriesCollectionRef);
    // Loop through each document in the "entries" subcollection
    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      // Assuming each entry document has an "entryText" field you want to extract
      if (entry && entry.entryText) {
        // Push the entry text and any other relevant data you need
        entriesData.push({
          id: doc.id, // the document ID
          text: entry.entryText, // the entry text
          // You can add more fields here if necessary, like `emotions` or `timestamp`
        });
      }
    });
    console.log("Extracted entries data: ", entriesData);
    return entriesData; // Return the array of entries data
  } catch (e) {
    console.error("Error extracting entries from Firestore: ", e);
  }
};


export const ExtractUserProfileFromFirebase = async (userId) => {
  let userProfileString = '';
  
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const age = userData.age || 'an unspecified age';
      const gender = userData.gender || 'unspecified gender';
      const hobbies = userData.hobbies || '';
      const goals = userData.goals ? userData.goals.join(", ") : '';
      const struggles = userData.struggles || '';

      userProfileString = `User is ${age} and ${gender}, with hobbies ${hobbies}, and goals ${goals}, and struggles ${struggles}.`;
      console.log(userProfileString);
    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user profile', error);
  }

  return userProfileString;
};

// Used in DataScreen.js page
export const ExtractUserNameFromFirebase = async (userId) => {
  let userName = ''; // Declare userName to be used throughout the function
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      userName = userData.name || 'an unspecified name'; // Directly assign to userName without const
      console.log(userName); // This will log the fetched name
    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user profile', error);
  }
  return userName; // Return the userName found or an empty string
};

// Used in DataScreen.js page
export const ExtractLastWeekEntriesFirebase = async (userId) => {
  let entriesData = []; // This will hold the formatted entries data
  try {
    const entriesCollectionRef = collection(db, 'users', userId, 'entries');
    const querySnapshot = await getDocs(entriesCollectionRef);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      // Check if the entry has an "entryText" field and a valid timestamp
      if (entry && entry.entryText && entry.timeStamp) {
        const entryDate = entry.timeStamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object

        // Only push the entry if it's from the last week to now
        if (entryDate >= oneWeekAgo) {
          entriesData.push({
            text: entry.entryText, // the entry text
            time: entryDate // the entry timestamp as a Date object
          });
        }
      }
    });
    console.log("Extracted entries data from the last week: ", entriesData);
    return entriesData; // Return the array of entries data
  } catch (e) {
    console.error("Error extracting entries from Firestore: ", e);
  }
};
