const admin = require("firebase-admin");

let firebaseAdmin = null;

try {
  // Try to load from service account key file
  const serviceAccount = require("../../serviceAccountKey.json");
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized from serviceAccountKey.json");
} catch (err) {
  // Fallback to environment variables
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("Firebase Admin initialized from environment variables");
  } else {
    console.warn("Firebase Admin not initialized - missing credentials");
  }
}

module.exports = firebaseAdmin;
