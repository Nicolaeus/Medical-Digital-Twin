/**
 * ==========================================================
 * Medical Digital Twin
 * WeatherService.js
 * Open-Meteo Weather Service
 * ==========================================================
 */

import Store from "../core/store.js";

class WeatherService {

    constructor() {

        this.provider = "Open-Meteo";

        this.endpoint = "https://api.open-meteo.com/v1/forecast";

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.initialized = true;

    }

    /* ======================================================
     * Current Weather
     * ====================================================== */

    async getCurrent(latitude, longitude) {

        const url = new URL(this.endpoint);

        url.searchParams.set("latitude", latitude);

        url.searchParams.set("longitude", longitude);

        url.searchParams.set(
            "current",
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "pressure_msl",
                "cloud_cover",
                "wind_speed_10m",
                "wind_direction_10m"
            ].join(",")
        );

        url.searchParams.set(
            "daily",
            [
                "sunrise",
                "sunset",
                "uv_index_max"
            ].join(",")
        );

        url.searchParams.set("timezone", "auto");

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error("Unable to retrieve weather data.");

        }

        const json = await response.json();

        return this.normalize(json);

    }

    /* ======================================================
     * Refresh Store
     * ====================================================== */

    async refresh() {

        const location = Store.get("environment.location");

        if (

            location.latitude == null ||

            location.longitude == null

        ) {

            return null;

        }

        const weather = await this.getCurrent(

            location.latitude,

            location.longitude

        );

        Store.update(

            "environment",

            weather

        );

        return weather;

    }

    /* ======================================================
     * Update Location
     * ====================================================== */

    async updateLocation(latitude, longitude) {

        Store.update(

            "environment.location",

            {

                latitude,

                longitude

            }

        );

        return this.refresh();

    }

    /* ======================================================
     * Normalize API
     * ====================================================== */

    normalize(data) {

        return {

            weather: {

                temperature: data.current.temperature_2m,

                feelsLike: data.current.apparent_temperature,

                humidity: data.current.relative_humidity_2m,

                pressure: data.current.pressure_msl,

                cloudCover: data.current.cloud_cover,

                windSpeed: data.current.wind_speed_10m,

                windDirection: data.current.wind_direction_10m

            },

            solar: {

                sunrise: data.daily.sunrise?.[0] ?? null,

                sunset: data.daily.sunset?.[0] ?? null,

                uvIndex: data.daily.uv_index_max?.[0] ?? null

            },

            source: this.provider,

            updatedAt: new Date().toISOString()

        };

    }

    /* ======================================================
     * Current State
     * ====================================================== */

    getState() {

        return Store.get("environment");

    }

}

export default new WeatherService();
