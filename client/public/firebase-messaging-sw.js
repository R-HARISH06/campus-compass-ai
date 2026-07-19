importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB3IP3bkyXxgXRSNR5jaNgOZ3l-eZNhtp0",
  authDomain: "campus-compass-35f8b.firebaseapp.com",
  projectId: "campus-compass-35f8b",
  storageBucket: "campus-compass-35f8b.firebasestorage.app",
  messagingSenderId: "493791768651",
  appId: "1:493791768651:web:633ff4c77eed93837c1dce",
  measurementId: "G-VJH6CLTKF5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
