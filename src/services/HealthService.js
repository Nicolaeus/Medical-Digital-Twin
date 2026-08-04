/**
 * ==========================================================
 * Medical Digital Twin
 * HealthService.js
 * Cross Platform Health Service
 * ==========================================================
 */

import AppleHealthService from "./AppleHealthService.js";
import HealthConnectService from "./HealthConnectService.js";

class HealthService {

    constructor() {

        this.provider = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        await AppleHealthService.init();
        await HealthConnectService.init();

        if (AppleHealthService.isAvailable()) {

            this.provider = AppleHealthService;

        }
        else if (HealthConnectService.isAvailable()) {

            this.provider = HealthConnectService;

        }
        else {

            this.provider = null;

        }

        return this.provider;

    }

    /* ======================================================
     * Availability
     * ====================================================== */

    isAvailable() {

        return this.provider !== null;

    }

    /* ======================================================
     * Provider
     * ====================================================== */

    getProvider() {

        return this.provider;

    }

    /* ======================================================
     * Connection
     * ====================================================== */

    async connect() {

        if (!this.provider) {

            throw new Error("No health provider available.");

        }

        return this.provider.connect();

    }

    async disconnect() {

        if (!this.provider) {

            return;

        }

        return this.provider.disconnect();

    }

    async requestPermissions(permissions = []) {

        if (!this.provider) {

            return [];

        }

        return this.provider.requestPermissions(permissions);

    }

    /* ======================================================
     * Activity
     * ====================================================== */

    async getSteps(options = {}) {

        return this.provider?.getSteps(options) ?? [];

    }

    async getDistance(options = {}) {

        return this.provider?.getDistance(options) ?? [];

    }

    async getCalories(options = {}) {

        return this.provider?.getCalories(options) ?? [];

    }

    /* ======================================================
     * Sleep
     * ====================================================== */

    async getSleep(options = {}) {

        return this.provider?.getSleep(options) ?? [];

    }

    /* ======================================================
     * Heart
     * ====================================================== */

    async getHeartRate(options = {}) {

        return this.provider?.getHeartRate(options) ?? [];

    }

    async getHeartRateVariability(options = {}) {

        return this.provider?.getHeartRateVariability(options) ?? [];

    }

    /* ======================================================
     * Body
     * ====================================================== */

    async getWeight(options = {}) {

        return this.provider?.getWeight(options) ?? [];

    }

    async getBodyFat(options = {}) {

        return this.provider?.getBodyFat(options) ?? [];

    }

    async getHeight(options = {}) {

        return this.provider?.getHeight(options) ?? [];

    }

    /* ======================================================
     * Blood Pressure
     * ====================================================== */

    async getBloodPressure(options = {}) {

        return this.provider?.getBloodPressure(options) ?? [];

    }

    /* ======================================================
     * Temperature
     * ====================================================== */

    async getBodyTemperature(options = {}) {

        return this.provider?.getBodyTemperature(options) ?? [];

    }

    /* ======================================================
     * Oxygen
     * ====================================================== */

    async getOxygenSaturation(options = {}) {

        return this.provider?.getOxygenSaturation(options) ?? [];

    }

}

export default new HealthService();
