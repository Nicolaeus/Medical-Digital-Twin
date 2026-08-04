/**
 * ==========================================================
 * Medical Digital Twin
 * api.js
 * API Manager
 * ==========================================================
 */

class API {

    constructor() {

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        console.log("🌐 API Manager initialized");

        this.initialized = true;

    }

}

export default new API();
