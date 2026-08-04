/**
 * ==========================================================
 * Medical Digital Twin
 * Header.js
 * Floating Hero Header
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";
import Store from "../../core/store.js";

export default class Header extends BaseComponent {

    constructor() {

        super({

            id: "header"

        });

        this.expanded = true;

        this.patient = {};

        this.health = {};

        this.environment = {};

    }

    /* ======================================================
     * Lifecycle
     * ====================================================== */

    async render() {

        this.element = document.createElement("header");

        this.element.className = "hero-header";

        this.refresh();

    }

    watchStore() {

        this.addWatcher(

            Store.watch(

                "patient",

                () => this.refresh()

            )

        );

        this.addWatcher(

            Store.watch(

                "health",

                () => this.refresh()

            )

        );

        this.addWatcher(

            Store.watch(

                "environment",

                () => this.refresh()

            )

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.patient = Store.clone("patient");

        this.health = Store.clone("health");

        this.environment = Store.clone("environment");

        this.element.innerHTML = `

            ${this.#renderTop()}

            ${this.#renderMetrics()}

        `;

        this.#applyTheme();

    }

    /* ======================================================
     * Expand / Collapse
     * ====================================================== */

    expand() {

        this.expanded = true;

        this.element.classList.remove(

            "collapsed"

        );

    }

    collapse() {

        this.expanded = false;

        this.element.classList.add(

            "collapsed"

        );

    }

    toggle() {

        this.expanded ?

            this.collapse()

            :

            this.expand();

    }

    /* ======================================================
     * Top
     * ====================================================== */

    #renderTop() {

        return `

            <div class="hero-content">

                ${this.#renderHeader()}

                ${this.#renderForecast()}

            </div>

        `;

    }

    /* ======================================================
     * Header
     * ====================================================== */

    #renderHeader() {

        const greeting = this.#getGreeting();

        const name =
            this.patient.firstName ||
            this.patient.displayName ||
            "Guest";

        const avatar =
            this.patient.avatar ||
            "assets/avatars/default.png";

        return `

            <div class="hero-top">

                <div class="hero-left">

                    <div class="hero-greeting">

                        ${greeting}

                    </div>

                    <div class="hero-title">

                        ${name}

                    </div>

                    ${this.#renderWeather()}

                </div>

                <div class="hero-avatar">

                    <img
                        src="${avatar}"
                        alt="${name}"
                    >

                </div>

            </div>

        `;

    }

    /* ======================================================
     * Outdoor Weather
     * ====================================================== */

    #renderWeather() {

        const weather = this.environment.weather || {};

        const icon =
            weather.icon || "☀️";

        const temperature =
            weather.temperature ?? "--";

        const city =
            this.environment.location?.city || "";

        return `

            <div class="hero-subtitle">

                ${icon}
                ${temperature}°C

                ${city ? `• ${city}` : ""}

            </div>

        `;

    }

    /* ======================================================
     * Body Forecast
     * ====================================================== */

    #renderForecast() {

        const forecast =
            this.#getBodyForecast();

        return `

            <div class="hero-forecast">

                <div class="hero-forecast-title">

                    ${forecast.icon}

                    ${forecast.title}

                </div>

                <div class="hero-forecast-text">

                    ${forecast.message}

                </div>

            </div>

        `;

    }

    /* ======================================================
     * Greeting
     * ====================================================== */

    #getGreeting() {

        const hour = new Date().getHours();

        if (hour < 12) {

            return "Good Morning";

        }

        if (hour < 18) {

            return "Good Afternoon";

        }

        return "Good Evening";

    }

    /* ======================================================
     * Body Forecast
     * ====================================================== */

    #getBodyForecast() {

        const recovery =
            this.health.recovery ?? 0;

        if (recovery >= 90) {

            return {

                icon: "☀️",

                title: "Body Forecast",

                message:
                    "Excellent recovery. Today is ideal for demanding activities."

            };

        }

        if (recovery >= 75) {

            return {

                icon: "🌤️",

                title: "Body Forecast",

                message:
                    "Good balance. Your body is ready for a productive day."

            };

        }

        if (recovery >= 50) {

            return {

                icon: "⛅",

                title: "Body Forecast",

                message:
                    "Moderate recovery. Consider pacing your effort."

            };

        }

        return {

            icon: "🌧️",

            title: "Body Forecast",

            message:
                "Recovery recommended. Prioritize sleep and hydration."

        };

    }

    /* ======================================================
     * Metrics
     * ====================================================== */

    #renderMetrics() {

        const recovery =
            this.health.recovery ?? "--";

        const energy =
            this.health.energy ?? "--";

        const sleep =
            this.health.sleep?.duration ?? "--";

        const steps =
            this.health.steps ?? "--";

        return `

            <div class="hero-bottom">

                ${this.#metric(

                    "❤️",

                    "Recovery",

                    recovery

                )}

                ${this.#metric(

                    "⚡",

                    "Energy",

                    energy

                )}

                ${this.#metric(

                    "😴",

                    "Sleep",

                    sleep

                )}

                ${this.#metric(

                    "🚶",

                    "Steps",

                    steps

                )}

            </div>

        `;

    }

    /* ======================================================
     * Metric Card
     * ====================================================== */

    #metric(icon, label, value) {

        return `

            <div class="hero-metric">

                <div class="hero-metric-label">

                    ${label}

                </div>

                <div class="hero-metric-value">

                    ${icon} ${value}

                </div>

            </div>

        `;

    }

    /* ======================================================
     * Theme
     * ====================================================== */

    #applyTheme() {

        this.element.classList.remove(

            "excellent",

            "good",

            "warning",

            "danger",

            "morning",

            "afternoon",

            "evening",

            "night"

        );

        const recovery =
            this.health.recovery ?? 0;

        if (recovery >= 90) {

            this.element.classList.add("excellent");

        }

        else if (recovery >= 75) {

            this.element.classList.add("good");

        }

        else if (recovery >= 50) {

            this.element.classList.add("warning");

        }

        else {

            this.element.classList.add("danger");

        }

        const hour = new Date().getHours();

        if (hour >= 6 && hour < 12) {

            this.element.classList.add("morning");

        }

        else if (hour < 18) {

            this.element.classList.add("afternoon");

        }

        else if (hour < 22) {

            this.element.classList.add("evening");

        }

        else {

            this.element.classList.add("night");

        }

    }

    /* ======================================================
     * Animation
     * ====================================================== */

    animateRefresh() {

        this.element.classList.remove(

            "refresh"

        );

        requestAnimationFrame(() => {

            this.element.classList.add(

                "refresh"

            );

        });

    }

}
