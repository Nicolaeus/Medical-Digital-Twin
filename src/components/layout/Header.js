/**
 * ==========================================================
 * Medical Digital Twin
 * Header.js
 * V3
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";
import Store from "../../core/store.js";

export default class Header extends BaseComponent {

    constructor() {

        super({

            id: "header"

        });

        this.patient = {};

        this.health = {};

        this.environment = {};

        this.expanded = true;

    }

    /* ======================================================
     * Lifecycle
     * ====================================================== */

    async render() {

        this.element = document.createElement("header");

        this.element.className = "mdt-header";

        this.watchStore();

        this.refresh();

    }

    /* ======================================================
     * Store
     * ====================================================== */

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

        this.patient =

            Store.clone("patient") || {};

        this.health =

            Store.clone("health") || {};

        this.environment =

            Store.clone("environment") || {};

        this.element.innerHTML = `

            ${this.#renderEnvironmentBar()}

            ${this.#renderHealthBar()}

        `;

        this.#applyTheme();

    }

    /* ======================================================
     * Expand / Collapse
     * ====================================================== */

    expand() {

        this.expanded = true;

        this.element.classList.remove(

            "compact"

        );

    }

    collapse() {

        this.expanded = false;

        this.element.classList.add(

            "compact"

        );

    }

    toggle() {

        this.expanded

            ? this.collapse()

            : this.expand();

    }

    /* ======================================================
     * Environment Bar
     * ====================================================== */

    #renderEnvironmentBar() {

        const weather =
            this.environment.weather ?? {};

        const moon =
            this.environment.moon ?? {};

        const sun =
            this.environment.sun ?? {};

        const air =
            this.environment.air ?? {};

        const location =
            this.environment.location ?? {};

        const avatar =
            this.patient.avatar ??
            "assets/avatars/default.png";

        return `

            <div class="mdt-header-top">

                <div class="mdt-weather">

                    <span class="mdt-weather-icon">

                        ${weather.icon ?? "☀️"}

                    </span>

                    <div class="mdt-weather-data">

                        <div class="mdt-weather-main">

                            ${weather.temperature ?? "--"}°C

                            •

                            ${location.city ?? "Unknown"}

                        </div>

                        <div class="mdt-weather-city">

                            🌙 ${moon.phase ?? "--"}

                            •

                            ↑ ${sun.sunrise ?? "--:--"}

                            ↓ ${sun.sunset ?? "--:--"}

                            •

                            AQI ${air.index ?? "--"}

                        </div>

                    </div>

                </div>

                <div class="mdt-avatar">

                    <img

                        src="${avatar}"

                        alt="Avatar"

                    >

                </div>

            </div>

        ";

    }

    /* ======================================================
     * Health Bar
     * ====================================================== */

    #renderHealthBar() {

        return `

            <div class="mdt-header-bottom">

                <div class="mdt-body-weather">

                    <span class="mdt-body-weather-icon">

                        ${this.#recoveryIcon()}

                    </span>

                    <span class="mdt-body-weather-text">

                        ${this.#recoveryText()}

                    </span>

                </div>

                ${this.#renderVitals()}

            </div>

        ";

    }

    /* ======================================================
     * Vitals
     * ====================================================== */

    #renderVitals() {

        return `

            <div class="mdt-vitals">

                <span>

                    ❤️ ${this.health.heartRate ?? "--"}

                </span>

                <span>

                    HRV ${this.health.hrv ?? "--"}

                </span>

                <span>

                    😴 ${this.health.sleep?.duration ?? "--"}

                </span>

                <span>

                    ⚡ ${this.health.energy ?? "--"}

                </span>

            </div>

        ";

    }

        /* ======================================================
     * Recovery
     * ====================================================== */

    #recoveryText() {

        const recovery =

            this.health.recovery ?? 0;

        if (recovery >= 90) {

            return "Excellent Recovery";

        }

        if (recovery >= 75) {

            return "Good Recovery";

        }

        if (recovery >= 50) {

            return "Moderate Recovery";

        }

        if (recovery >= 25) {

            return "Low Recovery";

        }

        return "Recovery Recommended";

    }

    #recoveryIcon() {

        const recovery =

            this.health.recovery ?? 0;

        if (recovery >= 90) {

            return "🟢";

        }

        if (recovery >= 75) {

            return "🟡";

        }

        if (recovery >= 50) {

            return "🟠";

        }

        return "🔴";

    }

    /* ======================================================
     * Theme
     * ====================================================== */

    #applyTheme() {

        this.element.classList.remove(

            "excellent",

            "good",

            "warning",

            "danger"

        );

        const recovery =

            this.health.recovery ?? 0;

        if (recovery >= 90) {

            this.element.classList.add(

                "excellent"

            );

        }

        else if (recovery >= 75) {

            this.element.classList.add(

                "good"

            );

        }

        else if (recovery >= 50) {

            this.element.classList.add(

                "warning"

            );

        }

        else {

            this.element.classList.add(

                "danger"

            );

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
