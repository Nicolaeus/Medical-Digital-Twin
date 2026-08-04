/**
 * ==========================================================
 * Medical Digital Twin
 * state.js
 * Initial Application State
 * Version 1.0
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * Patient
     * ------------------------------------------------------
     */

    patient: {

        id: null,

        firstName: "",

        lastName: "",

        birthDate: null,

        sex: null,

        height: null,

        weight: null,

        avatar: null

    },

    /**
     * ------------------------------------------------------
     * Environment
     * ------------------------------------------------------
     */

    environment: {

        location: null,

        weather: {

            icon: null,

            description: "",

            temperature: null,

            humidity: null,

            pressure: null,

            windSpeed: null,

            windDirection: null,

            uvIndex: null,

            sunrise: null,

            sunset: null

        },

        airQuality: {

            aqi: null,

            pollen: null

        },

        updatedAt: null

    },

    /**
     * ------------------------------------------------------
     * Health
     * ------------------------------------------------------
     */

    health: {

        recovery: null,

        energy: null,

        stress: null,

        sleep: null,

        biologicalAge: null,

        twinScore: null,

        bodyWeather: "",

        updatedAt: null

    },

    /**
     * ------------------------------------------------------
     * Body
     * ------------------------------------------------------
     */

    body: {

        heart: {},

        brain: {},

        lungs: {},

        liver: {},

        kidneys: {},

        stomach: {},

        intestine: {},

        pancreas: {},

        muscles: {},

        skeleton: {},

        skin: {}

    },

    /**
     * ------------------------------------------------------
     * Laboratory
     * ------------------------------------------------------
     */

    labs: {

        latest: [],

        history: [],

        abnormal: []

    },

    /**
     * ------------------------------------------------------
     * Timeline
     * ------------------------------------------------------
     */

    timeline: {

        events: []

    },

    /**
     * ------------------------------------------------------
     * Simulation
     * ------------------------------------------------------
     */

    simulation: {

        running: false,

        scenario: null,

        parameters: {},

        results: null

    },

    /**
     * ------------------------------------------------------
     * Insights
     * ------------------------------------------------------
     */

    insights: {

        today: [],

        recommendations: [],

        alerts: [],

        risks: []

    },

    /**
     * ------------------------------------------------------
     * Devices
     * ------------------------------------------------------
     */

    devices: {

        smartwatch: null,

        scale: null,

        bloodPressureMonitor: null,

        glucoseMonitor: null,

        thermometer: null

    },

    /**
     * ------------------------------------------------------
     * Settings
     * ------------------------------------------------------
     */

    settings: {

        language: "en",

        units: {

            temperature: "°C",

            distance: "km",

            weight: "kg",

            height: "cm"

        },

        notifications: true,

        darkMode: "system"

    },

    /**
     * ------------------------------------------------------
     * User Interface
     * ------------------------------------------------------
     */

    ui: {

        page: "dashboard",

        loading: false,

        modal: null,

        toast: null,

        sidebar: false

    }

};
