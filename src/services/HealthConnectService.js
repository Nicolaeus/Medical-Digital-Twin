/**
 * ==========================================================
 * Medical Digital Twin
 * HealthConnectService.js
 * Android Health Connect Service
 * ==========================================================
 */

class HealthConnectService {

    constructor() {

        this.available = false;

        this.connected = false;

        this.permissions = [];

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.available =

            "HealthConnect" in window;

        return this.available;

    }

    /* ======================================================
     * Availability
     * ====================================================== */

    isAvailable() {

        return this.available;

    }

    /* ======================================================
     * Connect
     * ====================================================== */

    async connect() {

        if (!this.available) {

            throw new Error(

                "Health Connect is not available."

            );

        }

        // TODO
        // Native bridge

        this.connected = true;

    }

    /* ======================================================
     * Disconnect
     * ====================================================== */

    async disconnect() {

        this.connected = false;

    }

    /* ======================================================
     * Permissions
     * ====================================================== */

    async requestPermissions(permissions = []) {

        // TODO
        // Native bridge

        this.permissions = permissions;

        return permissions;

    }

    hasPermission(permission) {

        return this.permissions.includes(permission);

    }

    /* ======================================================
     * Generic Read
     * ====================================================== */

    async read(recordType, options = {}) {

        // TODO
        // Native bridge

        console.log(

            "HealthConnect.read",

            recordType,

            options

        );

        return [];

    }

    /* ======================================================
     * Generic Write
     * ====================================================== */

    async write(recordType, data) {

        // TODO

        console.log(

            "HealthConnect.write",

            recordType,

            data

        );

        return true;

    }

    /* ======================================================
     * Activity
     * ====================================================== */

    async getSteps(options = {}) {

        return this.read(

            "Steps",

            options

        );

    }

    async getDistance(options = {}) {

        return this.read(

            "Distance",

            options

        );

    }

    async getCalories(options = {}) {

        return this.read(

            "ActiveCaloriesBurned",

            options

        );

    }

    /* ======================================================
     * Sleep
     * ====================================================== */

    async getSleep(options = {}) {

        return this.read(

            "SleepSession",

            options

        );

    }

    /* ======================================================
     * Heart
     * ====================================================== */

    async getHeartRate(options = {}) {

        return this.read(

            "HeartRate",

            options

        );

    }

    async getHeartRateVariability(options = {}) {

        return this.read(

            "HeartRateVariabilityRmssd",

            options

        );

    }

    /* ======================================================
     * Body
     * ====================================================== */

    async getWeight(options = {}) {

        return this.read(

            "Weight",

            options

        );

    }

    async getBodyFat(options = {}) {

        return this.read(

            "BodyFat",

            options

        );

    }

    async getHeight(options = {}) {

        return this.read(

            "Height",

            options

        );

    }

    /* ======================================================
     * Blood Pressure
     * ====================================================== */

    async getBloodPressure(options = {}) {

        return this.read(

            "BloodPressure",

            options

        );

    }

    /* ======================================================
     * Temperature
     * ====================================================== */

    async getBodyTemperature(options = {}) {

        return this.read(

            "BodyTemperature",

            options

        );

    }

    /* ======================================================
     * Oxygen
     * ====================================================== */

    async getOxygenSaturation(options = {}) {

        return this.read(

            "OxygenSaturation",

            options

        );

    }

}

export default new HealthConnectService();
