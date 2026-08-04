/**
 * ==========================================================
 * Medical Digital Twin
 * StorageService.js
 * Local Storage Service
 * ==========================================================
 */

class StorageService {

    constructor() {

        this.prefix = "mdt";

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(prefix = "mdt") {

        this.prefix = prefix;

        return true;

    }

    /* ======================================================
     * Build Storage Key
     * ====================================================== */

    buildKey(key) {

        return `${this.prefix}.${key}`;

    }

    /* ======================================================
     * Exists
     * ====================================================== */

    exists(key) {

        return localStorage.getItem(

            this.buildKey(key)

        ) !== null;

    }

    /* ======================================================
     * Save
     * ====================================================== */

    save(key, value) {

        localStorage.setItem(

            this.buildKey(key),

            JSON.stringify(value)

        );

    }

    /* ======================================================
     * Load
     * ====================================================== */

    load(key, defaultValue = null) {

        const value = localStorage.getItem(

            this.buildKey(key)

        );

        if (value === null) {

            return defaultValue;

        }

        try {

            return JSON.parse(value);

        }

        catch {

            return defaultValue;

        }

    }

    /* ======================================================
     * Remove
     * ====================================================== */

    remove(key) {

        localStorage.removeItem(

            this.buildKey(key)

        );

    }

    /* ======================================================
     * Clear MDT Storage
     * ====================================================== */

    clear() {

        const prefix = `${this.prefix}.`;

        Object.keys(localStorage).forEach(key => {

            if (key.startsWith(prefix)) {

                localStorage.removeItem(key);

            }

        });

    }

    /* ======================================================
     * Keys
     * ====================================================== */

    keys() {

        const prefix = `${this.prefix}.`;

        return Object.keys(localStorage)

            .filter(key => key.startsWith(prefix))

            .map(key => key.replace(prefix, ""));

    }

    /* ======================================================
     * Export
     * ====================================================== */

    export() {

        const data = {};

        this.keys().forEach(key => {

            data[key] = this.load(key);

        });

        return data;

    }

    /* ======================================================
     * Import
     * ====================================================== */

    import(data = {}) {

        Object.entries(data).forEach(

            ([key, value]) => {

                this.save(key, value);

            }

        );

    }

}

export default new StorageService();
