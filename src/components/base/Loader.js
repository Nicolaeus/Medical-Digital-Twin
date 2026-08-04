/**
 * ==========================================================
 * Medical Digital Twin
 * Loader.js
 * Generic Loader Component
 * ==========================================================
 */

import Widget from "./Widget.js";

export default class Loader extends Widget {

    constructor(options = {}) {

        super({

            id: options.id ?? "loader",

            title: options.title ?? "Loading..."

        });

        this.message = options.message ?? "";

        this.progress = 0;

        this.indeterminate = true;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "div"

        );

        this.element.className = "loader";

        this.refresh();

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        if (!this.element) {

            return;

        }

        this.setHTML(`

<div class="loader-card">

    <div class="loader-title">

        ${this.title}

    </div>

    <div class="loader-message">

        ${this.message}

    </div>

    <div class="loader-progress">

        <div

            class="loader-progress-bar"

            style="width:${this.progress}%"

        ></div>

    </div>

    <div class="loader-percent">

        ${this.indeterminate ? "" : this.progress + "%"}

    </div>

</div>

`);

    }

    /* ======================================================
     * Loading
     * ====================================================== */

    start(message = "") {

        this.progress = 0;

        this.message = message;

        this.show();

        this.refresh();

    }

    finish() {

        this.progress = 100;

        this.refresh();

        this.hide();

    }

    /* ======================================================
     * Progress
     * ====================================================== */

    setProgress(value) {

        this.indeterminate = false;

        this.progress = Math.max(

            0,

            Math.min(100, value)

        );

        this.refresh();

    }

    increment(step = 1) {

        this.setProgress(

            this.progress + step

        );

    }

    /* ======================================================
     * Message
     * ====================================================== */

    setMessage(message) {

        this.message = message;

        this.refresh();

    }

    /* ======================================================
     * Mode
     * ====================================================== */

    setIndeterminate(enabled = true) {

        this.indeterminate = enabled;

        this.refresh();

    }

}
