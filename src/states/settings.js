/**
 * ==========================================================
 * Medical Digital Twin
 * state/settings.js
 * Application Settings
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * General
     * ------------------------------------------------------
     */

    language: "en",

    locale: "en-GB",

    timezone: null,

    /**
     * ------------------------------------------------------
     * Appearance
     * ------------------------------------------------------
     */

    appearance: {

        theme: "system",      // light | dark | system

        accentColor: "blue",

        animations: true

    },

    /**
     * ------------------------------------------------------
     * Units
     * ------------------------------------------------------
     */

    units: {

        temperature: "°C",

        distance: "km",

        height: "cm",

        weight: "kg",

        pressure: "mmHg",

        energy: "kcal",

        glucose: "mmol/L"

    },

    /**
     * ------------------------------------------------------
     * Notifications
     * ------------------------------------------------------
     */

    notifications: {

        enabled: true,

        reminders: true,

        insights: true,

        simulation: true

    },

    /**
     * ------------------------------------------------------
     * Privacy
     * ------------------------------------------------------
     */

    privacy: {

        analytics: false,

        diagnostics: false,

        shareData: false

    },

    /**
     * ------------------------------------------------------
     * Synchronization
     * ------------------------------------------------------
     */

    synchronization: {

        automatic: true,

        interval: 15,

        lastSync: null

    }

};
