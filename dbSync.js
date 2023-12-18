// dbSync.js
const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const userModel = require("./src/user/user.model")

// Synchronize database with the main thread
parentPort.postMessage({ type: 'sync', data: workerData });

// Listen for updates from the main thread
parentPort.on('message', async (message) => {
  if (message.type === 'update') {
    // Update the local database
    Object.assign(workerData, message.data);

    // Update MongoDB collection
    await userModel.deleteMany();
    await userModel.create(Object.values(workerData));
  }
});
