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

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement("header");

        this.element.className = "hero-header";

        this.refresh();

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        const patient = Store.get("patient");

        const health = Store.get("health");

        const environment = Store.get("environment");

        const greeting = this.getGreeting();

        const name =
            patient.firstName ||
            patient.displayName ||
            "Guest";

        const avatar =
            patient.avatar ||
            "assets/avatars/default.png";

        const weatherIcon =
            environment.weather.icon || "☀️";

        const temperature =
            environment.weather.temperature ?? "--";

        const recovery =
            health.recovery ?? "--";

        const energy =
            health.energy ?? "--";

        const sleep =
            health.sleep.duration ?? "--";

        this.setHTML(`

<div class="hero-content">

    <div class="hero-top">

        <div class="hero-left">

            <div class="hero-greeting">

                ${greeting}

            </div>

            <div class="hero-title">

                ${name}

            </div>

            <div class="hero-subtitle">

                ${weatherIcon}
                ${temperature}°C

            </div>

        </div>

        <div class="hero-avatar">

            <img

                src="${avatar}"

                alt="${name}"

            >

        </div>

    </div>

    <div class="hero-bottom">

        <div class="hero-metric">

            <div class="hero-metric-label">

                Recovery

            </div>

            <div class="hero-metric-value">

                ❤️ ${recovery}

            </div>

        </div>

        <div class="hero-metric">

            <div class="hero-metric-label">

                Energy

            </div>

            <div class="hero-metric-value">

                ⚡ ${energy}

            </div>

        </div>

        <div class="hero-metric">

            <div class="hero-metric-label">

                Sleep

            </div>

            <div class="hero-metric-value">

                😴 ${sleep}

            </div>

        </div>

    </div>

</div>

`);

    }

    /* ======================================================
     * Greeting
     * ====================================================== */

    getGreeting() {

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

}

