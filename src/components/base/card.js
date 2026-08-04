/**
 * ==========================================================
 * Medical Digital Twin
 * Card.js
 * Base Card Component
 * ==========================================================
 */

import Widget from "./Widget.js";

export default class Card extends Widget {

    constructor(options = {}) {

        super(options);

        this.icon = options.icon ?? "";

        this.title = options.title ?? "";

        this.subtitle = options.subtitle ?? "";

        this.body = "";

        this.footer = "";

        this.collapsed = false;

    }

    /* ======================================================
     * Header
     * ====================================================== */

    setIcon(icon) {

        this.icon = icon;

        this.refresh();

    }

    setTitle(title) {

        this.title = title;

        this.refresh();

    }

    setSubtitle(subtitle) {

        this.subtitle = subtitle;

        this.refresh();

    }

    /* ======================================================
     * Content
     * ====================================================== */

    setBody(html) {

        this.body = html;

        this.refresh();

    }

    setFooter(html) {

        this.footer = html;

        this.refresh();

    }

    /* ======================================================
     * Collapse
     * ====================================================== */

    collapse() {

        this.collapsed = true;

        this.refresh();

    }

    expand() {

        this.collapsed = false;

        this.refresh();

    }

    toggle() {

        this.collapsed ?

            this.expand()

            :

            this.collapse();

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "section"

        );

        this.element.className = "card";

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

<div class="card-header">

    <div class="card-header-left">

        <div class="card-icon">

            ${this.icon}

        </div>

        <div>

            <div class="card-title">

                ${this.title}

            </div>

            <div class="card-subtitle">

                ${this.subtitle}

            </div>

        </div>

    </div>

</div>

${
    this.collapsed ?

    ""

    :

`

<div class="card-body">

${this.body}

</div>

<div class="card-footer">

${this.footer}

</div>

`
}

`);

    }

}
