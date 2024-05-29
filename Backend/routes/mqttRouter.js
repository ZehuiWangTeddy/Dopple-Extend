const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');

let clientCounter = 10000;
const subscriptions = {};

// MQTT Broker URL
let mqtt_host = process.env.MQTT_HOST || 'localhost'
let mqtt_port = process.env.MQTT_PORT || '1883'
let mqtt_path = process.env.MQTT_PATH || ''

const mqttUrl = `mqtt://${mqtt_host}:${mqtt_port}${mqtt_path}`;

// Connect to MQTT Broker
const client = mqtt.connect(mqttUrl, {
    clientId: 'dopple-dashboard-client'
});



// Callback function for successful MQTT connection
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    // Subscribe to MQTT topics
    client.subscribe('tailor/ORDER-PORTAL/#', function (err) {
        if (err) {
            console.error('Error subscribing to topic1:', err);
        } else {
            console.log('Subscribed to ORDER-PORTAL');
        }
    });
    client.subscribe('tailor/PRADA/#', function (err) {
        if (err) {
            console.error('Error subscribing to topic2:', err);
        } else {
            console.log('Subscribed to PRADA');
        }
    });
    client.subscribe('tailor/STATUS-REPORTER/#', function (err) {
        if (err) {
            console.error('Error subscribing to topic2:', err);
        } else {
            console.log('Subscribed to STATUS-REPORTER');
        }
    });
});

// Handle MQTT messages
client.on('message', function (topic, message) {
    // Handle MQTT message here as needed
    const data = message.toString();
    const event = { event: 'mqtt_message', topic: topic, data: data };

    console.log(topic, data);

    // Send MQTT message to all subscribers
    // Object.values(subscriptions).forEach(func => func(event));
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
        subscriptions[currentClientID] = undefined;
        res.end('OK');
    });
});

module.exports = router;
