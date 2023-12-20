// app.js
const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Worker } = require('worker_threads');
const dotenv = require('dotenv');
var cors = require('cors');
var routes = require('./routes');
const port = process.env.PORT || 4000;

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', cors(), routes);
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// In-memory database
const database = {};

// Worker thread for database synchronization
const syncWorker = new Worker('./dbSync.js', { workerData: database });

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist.' });
  });
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Request validation middleware
const validateRequest = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send('Bad Request: Request body is required');
    } else {
        next();
    }
};

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs - 1; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    app.listen(Number(port) + cluster.worker.id, () => {
        console.log(`Worker ${process.pid} started on port ${Number(port) + cluster.worker.id}`);
    });
}
