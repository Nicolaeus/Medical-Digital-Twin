/**
 * ==========================================================
 * Medical Digital Twin
 * state/health.js
 * Current Health State
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * Overall Health
     * ------------------------------------------------------
     */

    twinScore: null,

    biologicalAge: null,

    healthWeather: null,

    recovery: null,

    readiness: null,

    energy: null,

    stress: null,

    fatigue: null,

    hydration: null,

    pain: null,

    mood: null,

    /**
     * ------------------------------------------------------
     * Vital Signs
     * ------------------------------------------------------
     */

    vitals: {

        heartRate: null,

        restingHeartRate: null,

        heartRateVariability: null,

        respiratoryRate: null,

        oxygenSaturation: null,

        bodyTemperature: null,

        bloodPressure: {

            systolic: null,

            diastolic: null

        }

    },

    /**
     * ------------------------------------------------------
     * Sleep
     * ------------------------------------------------------
     */

    sleep: {

        duration: null,

        score: null,

        efficiency: null,

        deep: null,

        light: null,

        rem: null,

        awake: null

    },

    /**
     * ------------------------------------------------------
     * Activity
     * ------------------------------------------------------
     */

    activity: {

        steps: null,

        distance: null,

        calories: null,

        activeCalories: null,

        exerciseMinutes: null,

        standingHours: null

    },

    /**
     * ------------------------------------------------------
     * Body Composition
     * ------------------------------------------------------
     */

    bodyComposition: {

        weight: null,

        bmi: null,

        bodyFat: null,

        leanMass: null,

        muscleMass: null,

        boneMass: null,

        visceralFat: null,

        bodyWater: null

    },

    /**
     * ------------------------------------------------------
     * Metabolism
     * ------------------------------------------------------
     */

    metabolism: {

        bmr: null,

        tdee: null,

        metabolicAge: null

    },

    /**
     * ------------------------------------------------------
     * Nutrition
     * ------------------------------------------------------
     */

    nutrition: {

        calories: null,

        protein: null,

        carbohydrates: null,

        fat: null,

        fiber: null,

        water: null

    },

    /**
     * ------------------------------------------------------
     * Current Status
     * ------------------------------------------------------
     */

    status: {

        fasting: false,

        exercising: false,

        sleeping: false,

        ill: false

    },

    /**
     * ------------------------------------------------------
     * Metadata
     * ------------------------------------------------------
     */

    source: null,

    updatedAt: null

};
