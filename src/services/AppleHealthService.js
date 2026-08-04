/**
 * ==========================================================
 * Medical Digital Twin
 * AppleHealthService.js
 * Apple HealthKit Service
 * ==========================================================
 */

class AppleHealthService {

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

            "HealthKit" in window;

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

                "Apple Health is not available."

            );

        }

        // TODO
        // Native bridge (Capacitor / Swift)

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

        console.log(

            "AppleHealth.read",

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

            "AppleHealth.write",

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

            "stepCount",

            options

        );

    }

    async getDistance(options = {}) {

        return this.read(

            "distanceWalkingRunning",

            options

        );

    }

    async getCalories(options = {}) {

        return this.read(

            "activeEnergyBurned",

            options

        );

    }

    /* ======================================================
     * Sleep
     * ====================================================== */

    async getSleep(options = {}) {

        return this.read(

            "sleepAnalysis",

            options

        );

    }

    /* ======================================================
     * Heart
     * ====================================================== */

    async getHeartRate(options = {}) {

        return this.read(

            "heartRate",

            options

        );

    }

    async getHeartRateVariability(options = {}) {

        return this.read(

            "heartRateVariabilitySDNN",

            options

        );

    }

    /* ======================================================
     * Body
     * ====================================================== */

    async getWeight(options = {}) {

        return this.read(

            "bodyMass",

            options

        );

    }

    async getBodyFat(options = {}) {

        return this.read(

            "bodyFatPercentage",

            options

        );

    }

    async getHeight(options = {}) {

        return this.read(

            "height",

            options

        );

    }

    /* ======================================================
     * Blood Pressure
     * ====================================================== */

    async getBloodPressure(options = {}) {

        return this.read(

            "bloodPressure",

            options

        );

    }

    /* ======================================================
     * Temperature
     * ====================================================== */

    async getBodyTemperature(options = {}) {

        return this.read(

            "bodyTemperature",

            options

        );

    }

    /* ======================================================
     * Oxygen
     * ====================================================== */

    async getOxygenSaturation(options = {}) {

        return this.read(

            "oxygenSaturation",

            options

        );

    }

}

export default new AppleHealthService();
