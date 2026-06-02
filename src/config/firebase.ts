import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  projectId: "layer3dlabs-b62a7",
  appId: "1:309669601016:web:d195821e9c5487309f650d",
  storageBucket: "layer3dlabs-b62a7.firebasestorage.app",
  apiKey: "AIzaSyD-GkQpIUO9okl4EAbGPWavCFfsfuhWi7Y",
  authDomain: "layer3dlabs-b62a7.firebaseapp.com",
  messagingSenderId: "309669601016"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
