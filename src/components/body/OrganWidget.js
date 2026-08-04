/**
 * ==========================================================
 * Medical Digital Twin
 * OrganWidget.js
 * Floating Organ Information Card
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";
import Store from "../../core/store.js";

export default class OrganWidget extends BaseComponent {

    constructor() {

        super({

            id: "organ-widget"

        });

        this.organ = null;

        this.watchId = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.watchId = Store.watch(

            "body.selected",

            organ => {

                this.organ = organ;

                this.refresh();

            }

        );

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "aside"

        );

        this.element.className =

            "organ-widget";

        this.refresh();

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        if (!this.organ) {

            this.hide();

            return;

        }

        this.show();

        const health =

            Store.get("health");

        const body =

            Store.get("body");

        this.setHTML(`

<div class="organ-card">

    <div class="organ-header">

        <div class="organ-icon">

            ❤️

        </div>

        <div>

            <div class="organ-title">

                ${this.organ}

            </div>

            <div class="organ-status">

                Healthy

            </div>

        </div>

    </div>

    <div class="organ-section">

        <span>Heart Rate</span>

        <strong>

            ${health.heartRate ?? "--"} bpm

        </strong>

    </div>

    <div class="organ-section">

        <span>Risk</span>

        <strong>

            Low

        </strong>

    </div>

    <div class="organ-section">

        <span>Opacity</span>

        <strong>

            ${body.opacity ?? "100"} %

        </strong>

    </div>

    <button

        class="organ-open"

    >

        Open Details →

    </button>

</div>

`);

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.element.style.display = "";

    }

    hide() {

        this.element.style.display = "none";

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        if (this.watchId) {

            Store.unwatch(

                this.watchId

            );

        }

    }

}
