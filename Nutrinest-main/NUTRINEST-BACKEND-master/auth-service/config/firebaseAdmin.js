const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
const path = require("path");

const getFirebaseAuth = () => {
  if (getApps().length) return getAuth();

  let serviceAccount;
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.resolve(__dirname, "../../serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } else if (
    (process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) &&
    (process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL) &&
    (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)
  ) {
    serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
    };
  } else {
    throw new Error(
      "Firebase Admin is not configured. Add serviceAccountKey.json or Firebase Admin credentials."
    );
  }

  initializeApp({ credential: cert(serviceAccount) });
  return getAuth();
};

module.exports = getFirebaseAuth;
