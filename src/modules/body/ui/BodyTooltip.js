/**
 * ==========================================================
 * Medical Digital Twin
 * BodyTooltip.js
 * Anatomical Hover Tooltip
 * ==========================================================
 */

import Store from "../../../core/store.js";

export default class BodyTooltip {

    constructor() {

        this.element = null;

        this.visible = false;

        this.entity = null;

        this.pointerX = 0;

        this.pointerY = 0;

        this.hoverWatcher = null;

        this.pointerMoveHandler = null;

    }


    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        if (this.element) {

            return;

        }

        this.createElement();

        this.bindEvents();

        this.watchStore();

    }


    /* ======================================================
     * Create
     * ====================================================== */

    createElement() {

        this.element =
            document.createElement(
                "div"
            );

        this.element.className =
            "body-tooltip";

        this.element.setAttribute(
            "role",
            "tooltip"
        );

        this.element.hidden =
            true;

        document.body.appendChild(
            this.element
        );

    }


    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        this.pointerMoveHandler =
            event => {

                this.pointerX =
                    event.clientX;

                this.pointerY =
                    event.clientY;

                if (
                    this.visible
                ) {

                    this.position();

                }

            };

        document.addEventListener(
            "pointermove",
            this.pointerMoveHandler,
            {
                passive: true
            }
        );

    }


    /* ======================================================
     * Store
     * ====================================================== */

    watchStore() {

        /*
         * BodySelection will populate this state when
         * hover support is connected.
         *
         * We keep the component tolerant if the state
         * does not exist yet.
         */

        this.hoverWatcher =
            Store.watch(
                "body.hoveredEntity",
                entity => {

                    this.setEntity(
                        entity
                    );

                }
            );

    }


    /* ======================================================
     * Entity
     * ====================================================== */

    setEntity(entity) {

        this.entity =
            entity || null;

        if (!this.entity) {

            this.hide();

            return;

        }

        this.renderEntity();

        this.show();

    }


    /* ======================================================
     * Render Entity
     * ====================================================== */

    renderEntity() {

        if (!this.element) {

            return;

        }

        const name =
            this.getDisplayName(
                this.entity
            );

        const parent =
            this.entity
                ?.anatomical_parent_name
            ||
            this.entity
                ?.parent_name
            ||
            this.entity
                ?.region
            ||
            "";

        const laterality =
            this.entity
                ?.laterality;

        const category =
            this.entity
                ?.category;

        const secondary =
            [
                parent,
                laterality !== "none"
                    ? laterality
                    : "",
                category
            ]
                .filter(Boolean)
                .join(" · ");

        this.element.innerHTML = `

            <div class="body-tooltip-name">

                ${this.escapeHTML(name)}

            </div>

            ${
                secondary
                    ? `
                        <div class="body-tooltip-meta">
                            ${this.escapeHTML(secondary)}
                        </div>
                    `
                    : ""
            }

        `;

    }


    /* ======================================================
     * Position
     * ====================================================== */

    position() {

        if (
            !this.element
        ) {

            return;

        }

        const offsetX =
            16;

        const offsetY =
            18;

        let x =
            this.pointerX +
            offsetX;

        let y =
            this.pointerY +
            offsetY;

        const rect =
            this.element.getBoundingClientRect();

        const viewportWidth =
            window.innerWidth;

        const viewportHeight =
            window.innerHeight;

        if (
            x + rect.width >
            viewportWidth - 12
        ) {

            x =
                this.pointerX -
                rect.width -
                16;

        }

        if (
            y + rect.height >
            viewportHeight - 12
        ) {

            y =
                this.pointerY -
                rect.height -
                18;

        }

        this.element.style.left =
            `${Math.max(8, x)}px`;

        this.element.style.top =
            `${Math.max(8, y)}px`;

    }


    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        if (!this.element) {

            return;

        }

        this.visible =
            true;

        this.element.hidden =
            false;

        this.position();

        requestAnimationFrame(
            () => this.position()
        );

    }


    hide() {

        if (!this.element) {

            return;

        }

        this.visible =
            false;

        this.element.hidden =
            true;

    }


    /* ======================================================
     * Helpers
     * ====================================================== */

    getDisplayName(entity) {

        return (
            entity?.canonical_name
            ||
            entity?.display_name
            ||
            entity?.name
            ||
            "Structure anatomique"
        );

    }


    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        if (
            this.hoverWatcher !== null
        ) {

            Store.unwatch(
                this.hoverWatcher
            );

        }

        if (
            this.pointerMoveHandler
        ) {

            document.removeEventListener(
                "pointermove",
                this.pointerMoveHandler
            );

        }

        this.element?.remove();

        this.element =
            null;

        this.entity =
            null;

        this.hoverWatcher =
            null;

        this.pointerMoveHandler =
            null;

        this.visible =
            false;

    }

}
