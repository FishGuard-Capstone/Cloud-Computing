const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore client
const initFirestore = () => {
  const firestore = new Firestore({
    projectId: 'capstone-fish-guard',  // Your Google Cloud project ID
    keyFilename: './fishguard-key.json'  // Path to your service account key file
  });

  return firestore;
};

module.exports = { initFirestore };