import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB3IP3bkyXxgXRSNR5jaNgOZ3l-eZNhtp0",
  authDomain: "campus-compass-35f8b.firebaseapp.com",
  projectId: "campus-compass-35f8b",
  storageBucket: "campus-compass-35f8b.firebasestorage.app",
  messagingSenderId: "493791768651",
  appId: "1:493791768651:web:633ff4c77eed93837c1dce",
  measurementId: "G-VJH6CLTKF5"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { 
      vapidKey: "BNE1qIEzXSYK1fuFzXfJ5_qxy_v-0W6t0sP9ahf0VQ4OlKXqdX9cegxlEfju7S-z5oGclAeOpnr74rquoRMOwGg" 
    });
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    throw err;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
