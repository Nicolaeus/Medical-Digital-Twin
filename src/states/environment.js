/**
 * ==========================================================
 * Medical Digital Twin
 * state/environment.js
 * Environmental State
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * Location
     * ------------------------------------------------------
     */

    location: {

        latitude: null,

        longitude: null,

        altitude: null,

        city: "",

        region: "",

        country: "",

        timezone: "",

        indoor: false

    },

    /**
     * ------------------------------------------------------
     * Weather
     * ------------------------------------------------------
     */

    weather: {

        condition: "",

        description: "",

        icon: "",

        temperature: null,

        feelsLike: null,

        humidity: null,

        pressure: null,

        visibility: null,

        cloudCover: null,

        precipitation: null,

        precipitationProbability: null,

        windSpeed: null,

        windDirection: null,

        gustSpeed: null

    },

    /**
     * ------------------------------------------------------
     * Solar
     * ------------------------------------------------------
     */

    solar: {

        sunrise: null,

        sunset: null,

        daylightDuration: null,

        uvIndex: null,

        solarRadiation: null

    },

    /**
     * ------------------------------------------------------
     * Air Quality
     * ------------------------------------------------------
     */

    air: {

        aqi: null,

        pm1: null,

        pm2_5: null,

        pm10: null,

        ozone: null,

        nitrogenDioxide: null,

        sulfurDioxide: null,

        carbonMonoxide: null

    },

    /**
     * ------------------------------------------------------
     * Allergens
     * ------------------------------------------------------
     */

    allergens: {

        pollen: {

            tree: null,

            grass: null,

            weed: null

        },

        mold: null

    },

    /**
     * ------------------------------------------------------
     * Circadian
     * ------------------------------------------------------
     */

    circadian: {

        isDay: null,

        daylightPercent: null,

        moonPhase: "",

        moonIllumination: null

    },

    /**
     * ------------------------------------------------------
     * Exposure
     * ------------------------------------------------------
     */

    exposure: {

        uv: null,

        noise: null,

        radiation: null,

        electromagnetic: null

    },

    /**
     * ------------------------------------------------------
     * Metadata
     * ------------------------------------------------------
     */

    source: null,

    updatedAt: null

};
