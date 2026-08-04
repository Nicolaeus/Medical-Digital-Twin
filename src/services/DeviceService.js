/**
 * ==========================================================
 * Medical Digital Twin
 * DeviceService.js
 * Connected Devices Service
 * ==========================================================
 */

import Store from "../core/store.js";

class DeviceService {

    constructor() {

        this.devices = [];

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        return true;

    }

    /* ======================================================
     * Scan
     * ====================================================== */

    async scan() {

        // TODO
        // Bluetooth
        // USB
        // WiFi
        // BLE

        return this.devices;

    }

    /* ======================================================
     * Register
     * ====================================================== */

    register(device) {

        this.devices.push(device);

        this.sync();

        return device;

    }

    /* ======================================================
     * Unregister
     * ====================================================== */

    unregister(id) {

        this.devices = this.devices.filter(

            device => device.id !== id

        );

        this.sync();

    }

    /* ======================================================
     * Devices
     * ====================================================== */

    getDevices() {

        return this.devices;

    }

    getDevice(id) {

        return this.devices.find(

            device => device.id === id

        );

    }

    /* ======================================================
     * Connection
     * ====================================================== */

    async connect(id) {

        const device = this.getDevice(id);

        if (!device) {

            return false;

        }

        device.connected = true;

        this.sync();

        return true;

    }

    async disconnect(id) {

        const device = this.getDevice(id);

        if (!device) {

            return false;

        }

        device.connected = false;

        this.sync();

        return true;

    }

    /* ======================================================
     * Synchronization
     * ====================================================== */

    sync() {

        Store.set(

            "devices",

            structuredClone(this.devices)

        );

    }

    /* ======================================================
     * Import
     * ====================================================== */

    import(devices = []) {

        this.devices = structuredClone(devices);

        this.sync();

    }

    /* ======================================================
     * Export
     * ====================================================== */

    export() {

        return structuredClone(this.devices);

    }

    /* ======================================================
     * Clear
     * ====================================================== */

    clear() {

        this.devices = [];

        this.sync();

    }

}

export default new DeviceService();
