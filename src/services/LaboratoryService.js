/**
 * ==========================================================
 * Medical Digital Twin
 * LaboratoryService.js
 * Laboratory Data Service
 * ==========================================================
 */

import Store from "../core/store.js";

class LaboratoryService {

    constructor() {

        this.connected = false;

        this.provider = "Local";

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        return true;

    }

    /* ======================================================
     * Connection
     * ====================================================== */

    async connect() {

        this.connected = true;

        return true;

    }

    async disconnect() {

        this.connected = false;

    }

    isConnected() {

        return this.connected;

    }

    /* ======================================================
     * Synchronization
     * ====================================================== */

    async sync() {

        return Store.get("labs");

    }

    /* ======================================================
     * Latest Session
     * ====================================================== */

    getLatest() {

        return Store.get("labs.current");

    }

    /* ======================================================
     * Biomarkers
     * ====================================================== */

    getBiomarkers() {

        return Store.get("labs.biomarkers");

    }

    getBiomarker(code) {

        return Store.get(

            `labs.biomarkers.${code}`

        );

    }

    hasBiomarker(code) {

        return this.getBiomarker(code) !== undefined;

    }

    /* ======================================================
     * Add / Update Biomarker
     * ====================================================== */

    saveBiomarker(code, biomarker) {

        Store.set(

            `labs.biomarkers.${code}`,

            biomarker

        );

        return biomarker;

    }

    removeBiomarker(code) {

        const biomarkers = {

            ...this.getBiomarkers()

        };

        delete biomarkers[code];

        Store.set(

            "labs.biomarkers",

            biomarkers

        );

    }

    /* ======================================================
     * Abnormal Results
     * ====================================================== */

    getAbnormal() {

        return Store.get("labs.abnormal");

    }

    /* ======================================================
     * Pending Analyses
     * ====================================================== */

    getPending() {

        return Store.get("labs.pending");

    }

    /* ======================================================
     * Import
     * ====================================================== */

    async import(data) {

        console.log(

            "Laboratory import",

            data

        );

        return true;

    }

    /* ======================================================
     * Export
     * ====================================================== */

    export() {

        return Store.get("labs");

    }

    /* ======================================================
     * Clear
     * ====================================================== */

    clear() {

        Store.set(

            "labs.biomarkers",

            {}

        );

        Store.set(

            "labs.abnormal",

            []

        );

        Store.set(

            "labs.pending",

            []

        );

    }

}

export default new LaboratoryService();
