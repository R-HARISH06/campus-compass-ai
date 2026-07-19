const admin = require("firebase-admin");

let serviceAccount;
try {
  // Try to load from local file (development)
  serviceAccount = require("./firebaseAdmin.json");
} catch (error) {
  // Fallback to environment variable (production on Render)
  if (process.env.FIREBASE_ADMIN_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
    } catch (parseError) {
      console.error("Failed to parse FIREBASE_ADMIN_JSON environment variable");
    }
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized successfully.");
  } catch (error) {
    if (!/already exists/.test(error.message)) {
      console.error("Firebase admin initialization error", error.stack);
    }
  }
} else {
  console.warn("WARNING: Firebase Admin credentials not found. Push notifications will not work.");
}

const sendPush = async (message) => {
  return await admin.messaging().sendEachForMulticast(message);
};

module.exports = { sendPush };
