import { doc, getDoc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

export const testUser = "imIQfhTxJteweMhIh88zvRxq5NH2"

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
        const botSettingsDocRef = doc(db, `users/${userId}/botSettings/${bot}`);
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
      const docRef = doc(db, `users/${userId}/chats`, sessionID);
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
  let chatHistoryData = []; 
  try {
   
    const chatsCollectionRef = collection(db, `users/${userId}/chats`);
    const querySnapshot = await getDocs(chatsCollectionRef);
    querySnapshot.forEach((doc) => {
      const chatHistory = doc.data().chatHistory;
      if (chatHistory) {
        // Concatenate the chat history into a single string
        // Note: slice to ignore first message (instruction prompt). edit if needed later
        const chatString = chatHistory.slice(1).map(entry => `role: ${entry.role}, content: "${entry.content}"`).join('; ');
        // Store both the document ID and the chat string
        chatHistoryData.push({ id: doc.id, messages: chatString });
      }
    });

    console.log("Chat history data: ", chatHistoryData);
    return chatHistoryData;
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

export const generateRandomSessionID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
