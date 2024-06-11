const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');

let clientCounter = 10000;
const subscriptions = {};

// MQTT Broker URL
let mqtt_host = process.env.mqtt_host || '';
let mqtt_port = process.env.mqtt_port || '';
let mqtt_path = process.env.MQTT_PATH || '';

const mqttUrl = `mqtt://${mqtt_host}:${mqtt_port}${mqtt_path}`;

// Connect to MQTT Broker
const client = mqtt.connect(mqttUrl, {
    clientId: 'dopple-dashboard-client'
});

// List of doorbells
const doorbells = [
    "deurbel_voordeur",
    "deurbel_achterdeur",
    // Add more doorbells here as needed
];

// Callback function for successful MQTT connection
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    // Subscribe to additional topics
    client.subscribe('tailor/ORDER-PORTAL/dashboard', function (err) {
        if (err) {
            console.error('Error subscribing to ORDER-PORTAL:', err);
        } else {
            console.log('Subscribed to ORDER-PORTAL');
        }
    });
    client.subscribe('tailor/PRADA/dashboard', function (err) {
        if (err) {
            console.error('Error subscribing to PRADA:', err);
        } else {
            console.log('Subscribed to PRADA');
        }
    });
    client.subscribe('tailor/STATUS-REPORTER/dashboard', function (err) {
        if (err) {
            console.error('Error subscribing to STATUS-REPORTER:', err);
        } else {
            console.log('Subscribed to STATUS-REPORTER');
        }
    });
    client.subscribe('tailor/CHISEL-SERVER/dashboard', function(err) {
        if (err) {
            console.error('Error subscribing to CHISEL-SERVER:', err);
        } else {
            console.log('Subscribed to CHISEL-SERVER');
        }
    });

    // Subscribe to doorbell topics
    doorbells.forEach(doorbell => {
        const topic = `dopple_access/ringers/${doorbell}/doorbell`;
        client.subscribe(topic, function (err) {
            if (err) {
                console.error(`Error subscribing to ${doorbell} topic:`, err);
            } else {
                console.log(`Subscribed to ${doorbell} topic`);
            }
        });
    });
});

// Handle MQTT messages
client.on('message', function (topic, message) {
    let data;
    try {
        data = JSON.parse(message.toString());
    } catch (e) {
        data = message.toString();
    }
    
    if (data === null || data === undefined) {
        console.error('Received null or undefined data:', topic, message.toString());
        return;
    }

    const event = { event: 'mqtt_message', topic: topic, data: JSON.stringify({ state: data }) };

    console.log('MQTT message received:', topic, data);

    // Send MQTT message to all subscribers
    Object.values(subscriptions).forEach(func => {
        if (func) {
            func(event);
        }
    });
});

router.get('/subscribe', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',

        // CORS header
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    const currentClientID = clientCounter++;
    let counter = 0;
    console.log("system", "Connection started with id", currentClientID);

    const callback = (event) => {
        res.write(`event: ${event.event}\n`);
        res.write(`data: ${JSON.stringify(event)}\n`);
        res.write(`id: ${counter}\n\n`);
        counter += 1;
    };

    res.write('event: connected\n');
    res.write(`data: ${JSON.stringify({ connected: true, clientId: currentClientID })}\n`);
    res.write(`id: ${counter}\n\n`);
    counter += 1;
    subscriptions[currentClientID] = callback;

    req.on('close', () => {
        console.log("system", "Connection closed with id", currentClientID);
        delete subscriptions[currentClientID];
        res.end('OK');
    });
});

router.post('/open/achterdeur/password', async (req, res) => {
    // response json 
    res.json({ status: "success", message: 'Door opened' });
});
router.post('/open/voordeur/password', (req, res) => {
    // response json 
    res.json({ status: "success", message: 'Door opened' });
  });

module.exports = router;