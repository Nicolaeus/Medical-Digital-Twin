/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModule.js
 * Human Digital Twin Module
 * ==========================================================
 */

import BodyRenderer from "./renderer/BodyRenderer.js";
import AnatomicalCard from "./ui/AnatomicalCard.js";

export default class BodyModule {

    constructor() {

        this.root = null;

        this.renderer = null;

        this.card = null;

        this.cardRoot = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render(root) {

        this.root = root;

        /*
         * --------------------------------------------------
         * 3D Body
         * --------------------------------------------------
         */

        this.renderer =
            new BodyRenderer();

        await this.renderer.render(
            this.root
        );

        /*
         * --------------------------------------------------
         * Anatomical UI layer
         * --------------------------------------------------
         */

        this.createCardRoot();

        this.card =
            new AnatomicalCard({

                id:
                    "body-anatomical-card",

                icon:
                    "🧬",

                title:
                    "Structure anatomique"

            });

        await this.card.init();

        this.card.mount(
            this.cardRoot
        );

    }

    /* ======================================================
     * Card Root
     * ====================================================== */

    createCardRoot() {

        this.cardRoot =
            document.createElement(
                "div"
            );

        this.cardRoot.className =
            "body-anatomical-overlay";

        this.cardRoot.setAttribute(
            "aria-live",
            "polite"
        );

        this.root.appendChild(
            this.cardRoot
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

        this.card?.show();

    }

    /* ======================================================
     * Hide
     * ====================================================== */

    hide() {

        this.renderer?.hide();

        this.card?.hide();

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    async destroy() {

        this.card?.destroy();

        this.card = null;

        this.cardRoot?.remove();

        this.cardRoot = null;

        await this.renderer?.destroy?.();

        this.renderer = null;

        this.root = null;

    }

}
