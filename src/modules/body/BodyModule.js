/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModule.js
 * Human Digital Twin Module
 * ==========================================================
 */

import BodyRenderer from "./renderer/BodyRenderer.js";

export default class BodyModule {

    constructor(container = null) {

        this.container = container;

        this.renderer = null;

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(container = null) {

        if (this.initialized) {

            return;

        }

        if (container) {

            this.container = container;

        }

        if (!this.container) {

            throw new Error(

                "BodyModule requires a container."

            );

        }

        this.renderer = new BodyRenderer();

        await this.renderer.init(

            this.container

        );

        this.initialized = true;

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.renderer?.refresh();

    }

    /* ======================================================
     * Resize
     * ====================================================== */

    resize() {

        this.renderer?.resize();

    }

    /* ======================================================
     * Show
     * ====================================================== */

    show() {

        this.renderer?.show();

    }

    /* ======================================================
     * Hide
     * ====================================================== */

    hide() {

        this.renderer?.hide();

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.renderer?.destroy();

        this.renderer = null;

        this.initialized = false;

    }

}
