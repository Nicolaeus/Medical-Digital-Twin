/**
 * ==========================================================
 * Medical Digital Twin
 * Header.js
 * Version 4.0
 * Overlay Header
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

        this.header = {};

    }

    /* ======================================================
     * Lifecycle
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "header"

        );

        this.element.className =

            "mdt-header";

        this.watchStore();

        this.refresh();

    }

    /* ======================================================
     * Store
     * ====================================================== */

    watchStore() {

        this.addWatcher(

            Store.watch(

                "header",

                () => this.refresh()

            )

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.header =

            Store.clone("header") || {};

        this.element.innerHTML = `

            ${this.#renderEnvironmentRow()}

            ${this.#renderTwinRow()}

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
     * Environment Row
     * ====================================================== */

    #renderEnvironmentRow() {

        const environment =

            this.header.environment ?? {};

        const avatar =

            this.header.avatar ??

            "assets/avatars/default.png";

        return `

            <div class="mdt-header-top">

                <div class="mdt-environment">

                    ${this.#renderEnvironment(environment)}

                </div>

                <div class="mdt-avatar">

                    <img

                        src="${avatar}"

                        alt="Avatar"

                    >

                </div>

            </div>

        `;

    }

    /* ======================================================
     * Environment Renderer
     * ====================================================== */

    #renderEnvironment(environment) {

        return `

            <div class="mdt-weather">

                <span class="mdt-weather-icon">

                    ${environment.weatherIcon ?? "☀️"}

                </span>

                <div class="mdt-weather-data">

                    <div class="mdt-weather-main">

                        ${environment.temperature ?? "--"}°C

                        •

                        ${environment.city ?? "Unknown"}

                    </div>

                    <div class="mdt-weather-city">

                        🌙 ${environment.moon ?? "--"}

                        •

                        ↑ ${environment.sunrise ?? "--:--"}

                        ↓ ${environment.sunset ?? "--:--"}

                        •

                        UV ${environment.uv ?? "--"}

                        •

                        AQI ${environment.aqi ?? "--"}

                    </div>

                </div>

            </div>

        `;

    }

    /* ======================================================
     * Twin Row
     * ====================================================== */

    #renderTwinRow() {

        const twin =

            this.header.twin ?? {};

        return `

            <div class="mdt-header-bottom">

                ${this.#renderTwinStatus(twin)}

                ${this.#renderMetrics(twin.metrics)}

            </div>

        `;

    }

    /* ======================================================
     * Twin Status
     * ====================================================== */

    #renderTwinStatus(twin) {

        return `

            <div class="mdt-twin-status">

                <span class="mdt-twin-icon">

                    ${twin.icon ?? "🟢"}

                </span>

                <span class="mdt-twin-text">

                    ${twin.status ?? "Digital Twin Ready"}

                </span>

            </div>

        `;

    }

    /* ======================================================
     * Metrics
     * ====================================================== */

    #renderMetrics(metrics = []) {

        if (

            !Array.isArray(metrics) ||

            metrics.length === 0

        ) {

            return `

                <div class="mdt-vitals">

                    <span>

                        No metrics

                    </span>

                </div>

            `;

        }

        return `

            <div class="mdt-vitals">

                ${metrics.map(

                    metric => this.#renderMetric(metric)

                ).join("")}

            </div>

        `;

    }

    /* ======================================================
     * Metric
     * ====================================================== */

    #renderMetric(metric) {

        return `

            <span

                class="mdt-metric"

                title="${metric.label ?? ""}"

            >

                ${metric.icon ?? ""}

                ${metric.value ?? "--"}

                ${metric.unit ?? ""}

            </span>

        `;

    }

    /* ======================================================
     * Theme
     * ====================================================== */

    #applyTheme() {

        const theme =

            this.header.theme ??

            "default";

        this.element.className =

            `mdt-header ${theme}`;

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

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.element.classList.remove(

            "hidden"

        );

    }

    hide() {

        this.element.classList.add(

            "hidden"

        );

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        super.destroy();

    }

}
