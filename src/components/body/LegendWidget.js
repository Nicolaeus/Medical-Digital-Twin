/**
 * ==========================================================
 * Medical Digital Twin
 * LegendWidget.js
 * Dynamic Legend Widget
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";

export default class LegendWidget extends BaseComponent {

    constructor() {

        super({

            id: "legend-widget"

        });

        this.items = [

            {

                color: "#22C55E",

                label: "Healthy"

            },

            {

                color: "#FACC15",

                label: "Monitoring"

            },

            {

                color: "#F97316",

                label: "Warning"

            },

            {

                color: "#EF4444",

                label: "Critical"

            },

            {

                color: "#3B82F6",

                label: "Medical Device"

            },

            {

                color: "#8B5CF6",

                label: "Imaging"

            },

            {

                color: "#94A3B8",

                label: "Hidden"

            }

        ];

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "aside"

        );

        this.element.className =

            "legend-widget";

        this.refresh();

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.setHTML(`

<div class="legend-title">

    Legend

</div>

<div class="legend-items">

    ${this.items.map(

        item => this.itemHTML(item)

    ).join("")}

</div>

`);

    }

    /* ======================================================
     * Legend Item
     * ====================================================== */

    itemHTML(item) {

        return `

<div class="legend-item">

    <span

        class="legend-color"

        style="background:${item.color}"

    ></span>

    <span>

        ${item.label}

    </span>

</div>

`;

    }

    /* ======================================================
     * Data
     * ====================================================== */

    setItems(items = []) {

        this.items = items;

        this.refresh();

    }

    addItem(item) {

        this.items.push(item);

        this.refresh();

    }

    clear() {

        this.items = [];

        this.refresh();

    }

}
