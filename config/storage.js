const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  projectId: process.env.capstone-fish-guard,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});
