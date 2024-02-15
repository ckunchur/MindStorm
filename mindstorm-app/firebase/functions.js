import { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';


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
