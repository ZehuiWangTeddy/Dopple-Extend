import { connect } from "mqtt";
import names from './random_names.json' assert { type: "json" };

/**
 * Param that allows the console app to be exited.
 */
let requested_stop = false;

/**
 * Prevents the looper from starting if there is no connection
 */
let mqtt_connected = false;

/**
 * Gets the javascript timeout object so we can cancel the next looper call.
 */
let looper_timeout = null;
let door_looper_timeout = null;

/**
 * Frequency at which dashboard updates should be published.
 * Unit is in seconds
 */
const DASHBOARD_FREQUENCY = 30;
const CAMERA_FREQUENCY = 20; // recommended 20 seconds, since doorbell notification stays active for 15 seconds when pressed in real life

/**
 * Change this to connect to a different server
 */
const MQTT_URI = "mqtt://localhost:1883"

/**
 * List of services that this application emulates
 */
const SERVICES = [
    {
        key: "CHISEL-SERVER",
        name: "Chisel Server",
        keys: [
            { name: "total_production_orders", type: "number" },
            { name: "production_orders_planned_today", type: "number" },
            { name: "production_orders_planned_week", type: "number" },
            { name: "production_orders_in_progress", type: "list" },
            { name: "current_operator", type: "string" },
        ]
    },
    {
        key: "ORDER-PORTAL",
        name: "Order API",
        keys: [
            { name: "total_orders_reduson-bv_created", type: "number" },
            { name: "total_orders_reduson-bv_locked", type: "number" },
            { name: "total_orders_reduson-bv_confirmed", type: "number" },
            { name: "total_orders_reduson-bv_in_production", type: "number" },
            { name: "total_orders_reduson-bv_shipped", type: "number" },
            { name: "total_orders_reduson-bv_completed", type: "number" },

            { name: "total_orders_earsonly_created", type: "number" },
            { name: "total_orders_earsonly_locked", type: "number" },
            { name: "total_orders_earsonly_confirmed", type: "number" },
            { name: "total_orders_earsonly_in_production", type: "number" },
            { name: "total_orders_earsonly_shipped", type: "number" },
            { name: "total_orders_earsonly_completed", type: "number" },

            { name: "total_orders_demo-sales-tenant_created", type: "number" },
            { name: "total_orders_demo-sales-tenant_locked", type: "number" },
            { name: "total_orders_demo-sales-tenant_confirmed", type: "number" },
            { name: "total_orders_demo-sales-tenant_in_production", type: "number" },
            { name: "total_orders_demo-sales-tenant_shipped", type: "number" },
            { name: "total_orders_demo-sales-tenant_completed", type: "number" },

            { name: "total_orders_comfoor-bv_created", type: "number" },
            { name: "total_orders_comfoor-bv_locked", type: "number" },
            { name: "total_orders_comfoor-bv_confirmed", type: "number" },
            { name: "total_orders_comfoor-bv_in_production", type: "number" },
            { name: "total_orders_comfoor-bv_shipped", type: "number" },
            { name: "total_orders_comfoor-bv_completed", type: "number" },

            { name: "total_orders_elacin-international-bv_created", type: "number" },
            { name: "total_orders_elacin-international-bv_locked", type: "number" },
            { name: "total_orders_elacin-international-bv_confirmed", type: "number" },
            { name: "total_orders_elacin-international-bv_in_production", type: "number" },
            { name: "total_orders_elacin-international-bv_shipped", type: "number" },
            { name: "total_orders_elacin-international-bv_completed", type: "number" },

            { name: "total_orders_cotral-lab-france_created", type: "number" },
            { name: "total_orders_cotral-lab-france_locked", type: "number" },
            { name: "total_orders_cotral-lab-france_confirmed", type: "number" },
            { name: "total_orders_cotral-lab-france_in_production", type: "number" },
            { name: "total_orders_cotral-lab-france_shipped", type: "number" },
            { name: "total_orders_cotral-lab-france_completed", type: "number" },
        ]
    },
    {
        key: "PRADA",
        name: "Printing Service",
        keys: [
            { name: "printer_1_status", type: "string" },
            { name: "printer_2_status", type: "string" },
            { name: "printer_3_status", type: "string" },
        ]
    },
    {
        key: "STATUS-REPORTER",
        name: "Status Reporter",
        keys: [
            { name: "service_order-portal_status", type: "string" },
            { name: "service_chisel-server_status", type: "string" },
            { name: "service_exact-broker_status", type: "string" },
            { name: "service_tassel_status", type: "string" },
            { name: "service_reify-server_status", type: "string" },
            { name: "service_prada_status", type: "string" },
            { name: "service_xray_status", type: "string" },
            { name: "service_chanel_status", type: "string" },
            { name: "service_reify_status", type: "string" },
            { name: "service_ribbon_status", type: "string" },
            { name: "service_aglet_status", type: "string" },
            { name: "service_new-earsonly_status", type: "string" },
        ]
    },
    {
        key: "GATEKEEPER",
        name: "Dopple Access Controller",
        keys: [
            { name: "doors_opened_today", type: "number" },
            { name: "gate_opened_today", type: "number" },
        ]
    }
];

/**
 * Function that holds the code for the publishing of data that runs on a loop.
 */
const loopFunction = async () => {
    console.log(logtime(), "EMULATING_SERVICES")

    // Loop through all the available services
    for (let service of SERVICES) {
        const keys = service.keys;

        // create the MQTT packet template.
        let packet = {
            last_updated: new Date().toLocaleString("nl-NL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                second: "2-digit",
                minute: "2-digit",
                hour12: false
            }),
            service_name: service.name,
            keys: {},
            values: {}
        };

        const PRINTER_STATUS_STRINGS = ["PRINTING", "FREE"]
        const SERVICE_STATUS_STRINGS = ["ONLINE", "OFFLINE", "WARNING"]

        // Loop through all the given keys.
        for (let key of keys) {
            packet.keys[key.name] = key.type;

            // generate random values for each type.
            switch (key.type) {
                case "number":
                    packet.values[key.name] = Math.round(Math.random() * 1000)
                    break;
                case "string":
                    if (key.name.includes("print")) {
                        packet.values[key.name] = PRINTER_STATUS_STRINGS[Math.floor(Math.random() * PRINTER_STATUS_STRINGS.length)];
                    }
                    else if (key.name.includes("service")) {
                        packet.values[key.name] = SERVICE_STATUS_STRINGS[Math.floor(Math.random() * SERVICE_STATUS_STRINGS.length)];
                    }
                    else {
                        packet.values[key.name] = names[Math.floor(Math.random() * names.length)];
                    }

                    break;
                case "list":
                    packet.values[key.name] = [];
                    const listLength = 5;
                    for (let i = 0; i < listLength; i++) {
                        packet.values[key.name].push(i + " " + names[Math.floor(Math.random() * names.length)]);
                    }
                    break;
            }
        }

        // Publish the packet to MQTT with retention.
        await client.publishAsync('tailor/' + service.key + "/dashboard", JSON.stringify(packet), {
            retain: true
        });
    }
}

const doorFunctionInitToOff = async () => {
    const doorbells = [
        "deurbel_voordeur",
        "deurbel_achterdeur"
    ];

    const motionCamera = [
        "parkeerplaats_achter",
        "deurbel_voordeur",
        "hal",
        "hal_lift",
        "deurbel_achterdeur"
    ];

    for (const bel of doorbells) {
        await client.publishAsync(`dopple_access/ringers/${bel}/doorbell`, JSON.stringify({ state: "OFF" }));
    }

    for (const camera of motionCamera) {
        await client.publishAsync(`dopple_access/cameras/${camera}/motion`, JSON.stringify({ state: "OFF" }));
    }
}

const loopDoorUpdateFunction = async () => {
    const doorbells = [
        "deurbel_voordeur",
        "deurbel_achterdeur"
    ];

    const motionCamera = [
        "parkeerplaats_achter",
        "deurbel_voordeur",
        "hal",
        "hal_lift",
        "deurbel_achterdeur"
    ];

    for (const bel of doorbells) {
        const random = Math.floor(Math.random() * 100);
        if (random % 5 === 0) {
            await client.publishAsync(`dopple_access/ringers/${bel}/doorbell`, JSON.stringify({ state: "ON" }));
            setTimeout(async () => {
                await client.publishAsync(`dopple_access/ringers/${bel}/doorbell`, JSON.stringify({ state: "OFF" }));
            }, 15 * 1000);
        }
    }

    for (const camera of motionCamera) {
        const random = Math.floor(Math.random() * 50);
        if (random % 5 === 0) {
            await client.publishAsync(`dopple_access/cameras/${camera}/motion`, JSON.stringify({ state: "ON" }));
            setTimeout(async () => {
                await client.publishAsync(`dopple_access/cameras/${camera}/motion`, JSON.stringify({ state: "OFF" }));
            }, 3 * 1000);
        }
    }
}

/**
 * Creates the MQTT client.
 * Change the params as you see fit.
 */
var client = connect(MQTT_URI, {
    clientId: "nhlstenden-students-dashboard-client",
    resubscribe: true,
    clean: true
});

/**
 * MQTT Event -> OnError
 */
client.on('error', (error) => {
    console.log(logtime(), "MQTT_ERROR", error)
})

/**
 * MQTT Event -> OnConnect
 */
client.on('connect', (conn_packet) => {
    console.log(logtime(), "MQTT_CONNECTED")
    mqtt_connected = true;

    // Once connected -> start looper
    loopController()
    doorFunctionInitToOff().then(() => {
        // start looper
        doorLooper();
    })
});

/**
 * MQTT Event -> OnDisconnect
 */
client.on('disconnect', (conn_packet) => {
    console.log(logtime(), "MQTT_DISCONNECTED")
    mqtt_connected = false;
    if (looper_timeout) {
        clearTimeout(looper_timeout);
    }
    if (door_looper_timeout) {
        clearTimeout(door_looper_timeout);
    }

});

/**
 * Setup the Windows support for using CTRL+C as a way to safely exit the program
 */
if (process.platform === "win32") {
    // var rl = require("readline").createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });

    // rl.on("SIGINT", function () {
    //     process.emit("SIGINT");
    // });
    import("readline").then(readline => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
    });
}

/**
 * Callback from the console when CTRL+C is pressed
 * Will exit the current program safely
 */
process.on('SIGINT', () => {
    if (!requested_stop) {
        console.log(logtime(), "STOPPING_SERVER")
        client.end()
        requested_stop = true;
    }
});

/**
 * Function that maintains the loop
 */
const loopController = () => {
    if (mqtt_connected) {
        loopFunction().catch((err) => {
            console.log(logtime(), "LOOPER_CRASHED", err.message)
        }).finally(() => {
            looper_timeout = setTimeout(loopController, DASHBOARD_FREQUENCY * 1000);
        });
    }
}

const doorLooper = () => {
    if (mqtt_connected) {

        loopDoorUpdateFunction().catch((err) => {
            console.log(logtime(), "DOOR_LOOPER_CRASHED", err.message)
        }).finally(() => {
            door_looper_timeout = setTimeout(doorLooper, CAMERA_FREQUENCY * 1000);
        });
    }
}

/**
 * Function that checks every 100ms if the code should exit.
 */
const exitController = () => {
    if (requested_stop) {
        process.exit(1);
    }
    else {
        setTimeout(exitController, 100);
    }
}

function logtime() {
    return "[" + new Date().toLocaleString("nl-NL", {
        hour: "2-digit",
        second: "2-digit",
        minute: "2-digit",
        hour12: false
    }) + "]>"
}

exitController()