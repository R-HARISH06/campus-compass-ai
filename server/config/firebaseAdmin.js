const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const serviceAccount = require("./firebaseAdmin.json");

if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (err) {
    console.error("Firebase Admin SDK initialization error:", err);
  }
}

const sendPush = async (message) => {
  return await getMessaging().sendEachForMulticast(message);
};

module.exports = { sendPush };
