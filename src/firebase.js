import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = { 
  apiKey: "AIzaSyBZsza33A9WhqSaywN3XJ4CsTa5lon8VPg", 
  authDomain: "nexis-games.firebaseapp.com", 
  projectId: "nexis-games", 
  storageBucket: "nexis-games.firebasestorage.app", 
  messagingSenderId: "291409336146", 
  appId: "1:291409336146:web:adf717a48f75469c44cc8b" 
};

export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
export const db = getFirestore(app); 

try {
  enableIndexedDbPersistence(db).catch(() => {}); 
} catch (e) {
  console.warn("Failed to enable offline persistence");
}
