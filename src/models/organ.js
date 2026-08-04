/**
 * ==========================================================
 * Medical Digital Twin
 * models/Organ.js
 * Universal Organ Data Model
 * Version 1.0
 * ==========================================================
 */

export default function createOrgan(id, name, system) {

    return {

        /* ==================================================
         * Identity
         * ================================================== */

        id,

        name,

        system,

        laterality: "none",       // none | left | right | paired

        category: null,           // organ, gland, vessel...

        description: "",

        visible: true,

        /* ==================================================
         * State
         * ================================================== */

        enabled: true,

        status: "unknown",        // healthy, warning, critical...

        score: null,              // 0 - 100

        confidence: null,

        /* ==================================================
         * Anatomy
         * ================================================== */

        anatomy: {

            volume: null,

            mass: null,

            density: null,

            dimensions: {

                width: null,

                height: null,

                depth: null

            }

        },

        /* ==================================================
         * Physiology
         * ================================================== */

        physiology: {

            perfusion: null,

            oxygenation: null,

            metabolism: null,

            temperature: null,

            activity: null

        },

        /* ==================================================
         * Functional Indicators
         * ================================================== */

        function: {

            capacity: null,

            efficiency: null,

            reserve: null,

            workload: null

        },

        /* ==================================================
         * Measurements
         * ================================================== */

        measurements: {

        },

        /* ==================================================
         * Biomarkers
         * ================================================== */

        biomarkers: {

        },

        /* ==================================================
         * Imaging
         * ================================================== */

        imaging: {

            ct: [],

            mr: [],

            pet: [],

            spect: [],

            ultrasound: [],

            xray: []

        },

        /* ==================================================
         * Pathology
         * ================================================== */

        pathology: {

            diseases: [],

            lesions: [],

            abnormalities: [],

            findings: []

        },

        /* ==================================================
         * Risks
         * ================================================== */

        risks: {

            cardiovascular: null,

            cancer: null,

            inflammation: null,

            degeneration: null,

            infection: null

        },

        /* ==================================================
         * Treatments
         * ================================================== */

        treatments: {

            medications: [],

            surgery: [],

            radiotherapy: [],

            followUp: []

        },

        /* ==================================================
         * Simulation
         * ================================================== */

        simulation: {

            enabled: true,

            predictedState: null,

            scenarios: [],

            lastSimulation: null

        },

        /* ==================================================
         * AI
         * ================================================== */

        ai: {

            summary: "",

            recommendations: [],

            alerts: [],

            predictions: []

        },

        /* ==================================================
         * Timeline
         * ================================================== */

        history: {

            observations: [],

            events: [],

            examinations: []

        },

        /* ==================================================
         * Metadata
         * ================================================== */

        source: null,

        updatedAt: null

    };

}
