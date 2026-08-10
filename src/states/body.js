/**
 * ==========================================================
 * Medical Digital Twin
 * state/body.js
 * Body State
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * 3D Interaction
     * ------------------------------------------------------
     *
     * État de navigation et d'interaction avec le
     * modèle anatomique 3D.
     */

    selected: null,

    selectedEntity: null,

    hoveredEntity: null,

    anatomicalLevel: "global",


    /**
     * ------------------------------------------------------
     * Anatomical Systems
     * ------------------------------------------------------
     */

    systems: {

        cardiovascular: {

            score: null,

            status: null

        },

        respiratory: {

            score: null,

            status: null

        },

        nervous: {

            score: null,

            status: null

        },

        digestive: {

            score: null,

            status: null

        },

        endocrine: {

            score: null,

            status: null

        },

        urinary: {

            score: null,

            status: null

        },

        musculoskeletal: {

            score: null,

            status: null

        },

        immune: {

            score: null,

            status: null

        },

        integumentary: {

            score: null,

            status: null

        },

        reproductive: {

            score: null,

            status: null

        },

        lymphatic: {

            score: null,

            status: null

        }

    },


    /**
     * ------------------------------------------------------
     * Organs
     * ------------------------------------------------------
     */

    organs: {

        brain: {},

        heart: {},

        lungs: {},

        liver: {},

        stomach: {},

        pancreas: {},

        spleen: {},

        kidneys: {},

        bladder: {},

        intestines: {},

        thyroid: {},

        skin: {}

    },


    /**
     * ------------------------------------------------------
     * Musculoskeletal
     * ------------------------------------------------------
     */

    muscles: {},

    bones: {},

    joints: {},


    /**
     * ------------------------------------------------------
     * Vascular Network
     * ------------------------------------------------------
     */

    vessels: {

        arteries: {},

        veins: {},

        capillaries: {}

    },


    /**
     * ------------------------------------------------------
     * Sensors
     * ------------------------------------------------------
     */

    sensors: {

        smartwatch: null,

        scale: null,

        bloodPressureMonitor: null,

        glucoseMonitor: null,

        thermometer: null,

        pulseOximeter: null

    },


    /**
     * ------------------------------------------------------
     * Metadata
     * ------------------------------------------------------
     */

    updatedAt: null

};
