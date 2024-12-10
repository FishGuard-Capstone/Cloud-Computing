const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "capstone-fish-guard",
      private_key_id: "6d8132bc3db2ef6988b969f7fa33807b1ac5fd63",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZMueMlkMPNtIH\nfFQ2Q2dMoUo83sdikS5UfL0WY8RWtdQyNd0BKvzVuJULktxVt3MZGbDMWxniZosC\nKqEVHHzBLiOCBfpbyVsSscjZwq2b5w8z8JB5Dh0yv6irfO7vFJ/7norrNn7LrTHP\nvxHrojEn7O7i8evZkbMnBXEblx9y63nPQnjzcZcAyLlcfstE18DhdyDFuXoJwmXO\nj8sBS+JLBCfMWLem1MnKwodQP+661Yg3n50/0lTg/s9yNGWErQVPfydvqTMOmhaq\nh3W/0rWusDLKhs8RhH3AJWEvkw8G1cnR6mCkrBVfgvpV0Nixl7Gr3L/44zz3nE1J\naASXiiZBAgMBAAECggEAI0HqqX0o5JrbDEEH8IkPhzZ1dR0a06rKkQdwsGZAlGzO\nxdnNhueCBHWCqE7OOpHderkbZIjzUjegIBlobaNisv843132DplIkefPOV4rTW/8\nHUvTP/tlDPxktnXA2YmJENDjLxx5B7oVKGqVT6FUBm2lN6zawsYuhUqSWk61WbOI\nH4V6LX9mGhOfhZwR7v8vaUkiKNa1Nhd5LHOTEHEh6i7ArQtpRcaQnV4Mijk5RAta\npXAvNtOXQ5d3nX7n7N72pfT+VWSs68i6ieeSm2T6VeZ6wI4a1mZpPvqZ2gDilKaf\nz+KtiqqfZu3kQirvB0alMOn0ZI99RqqHTedls7ZRuQKBgQD9ovucskr4cyLj3pS/\nDoNk3+MDT3Ouf45q2kbL//yzKhgHGtWl4SPIE38LUuFdwgq6V2/MO8AdXnMmA8CS\nNdosHn6JHhWbc3kU/ZOuMggzOmpb8WVAz9zMI0wDHCKgkaJqXERzpV3+/1ON5ry+\nBO77kvRVEDnuv1AoQ6W4uZgOxQKBgQDbOQEF7uNGbua09uEkpasu0MbRe2a/t6qq\n1iO7vC6bAonCZKzMzTcXZhTQuRIayhHoSlv1Fj5rXMvbv8x6N889CHCdfb603kM6\nqrlEyxpYzZnjuKkoBbsY99+FEYIm+ef7klHyHVICE64gKb8w9trTDmy5P1EnFr7b\nMnnpIbIxTQKBgQCO3qPEnFnGoXRhzxsSk+ZHiCWj07lh7dAXOGTwvH1nnqpyNhdq\nnOs+5FyH0GPKIGdSl7YN4QpSgMV0AGEU+uiuOW8lZaDeM6lcvYnWcbBUyu7mY4+Z\ndnz1MFy807hdoitOpjKYwem0nbY/FF3022qSozCmScGYToOkapaK+2A/0QKBgFnf\nwN+h1GNnzAWcwSi5ErkatqfjI3it37YyHGw29hRusfOUOpOr/k4Fd7sqZJW/CiBl\ne9W6zNRPMvRgaYAhqUCoWSL4DlswU/eVTmc5rQ+DGvgVGKRj1RSjamuvheBczBKD\nJj1Qb/KSBu0AsHVufr/QRhqcLrULyisrQnelbNxxAoGBAPQ4HMqzpfynVmMWACU4\nsYnhvVaMkFuOZpHnSSE8zYYuofec5BBTy49hipmwe6LjwX7koFWwSPobpcuKrI/N\neB5o67fwYLRiQ/TBYhzWrFnjLo2IGk33Y+aUMPj5oGlTEqfGRuoobdvZjxrMLCoB\najxD87AVKff+vjwZjDhlPVrp\n-----END PRIVATE KEY-----\n",
      client_email:"fishguard@capstone-fish-guard.iam.gserviceaccount.com",
      client_id: "108711904189060525367",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/fishguard%40capstone-fish-guard.iam.gserviceaccount.com"
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });

  return admin.firestore();
};

module.exports = { initFirebase };