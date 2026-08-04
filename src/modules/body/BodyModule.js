/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModule.js
 * Human Digital Twin Module
 * ==========================================================
 */

import BodyRenderer from "./renderer/BodyRenderer.js";

export default class BodyModule {

    constructor() {

        this.root = null;

        this.renderer = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render(root) {

        this.root = root;

        this.renderer = new BodyRenderer();

        await this.renderer.render(

            this.root

        );

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

    async destroy() {

        await this.renderer?.destroy?.();

        this.renderer = null;

        this.root = null;

    }

}
