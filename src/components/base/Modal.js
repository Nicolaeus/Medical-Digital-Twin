/**
 * ==========================================================
 * Medical Digital Twin
 * Modal.js
 * Generic Modal Component
 * ==========================================================
 */

import BaseComponent from "./BaseComponent.js";

export default class Modal extends BaseComponent {

    constructor(options = {}) {

        super({

            id: options.id ?? "modal"

        });

        this.title = options.title ?? "";

        this.content = "";

        this.footer = "";

        this.opened = false;

        this.closable = true;

        this.onConfirm = null;

        this.onCancel = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "div"

        );

        this.element.className =

            "modal-overlay";

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

<div class="modal-window">

    <div class="modal-header">

        <div class="modal-title">

            ${this.title}

        </div>

        ${
            this.closable ?

            `
            <button
                class="modal-close"
            >
                ✕
            </button>
            `
            :

            ""
        }

    </div>

    <div class="modal-content">

        ${this.content}

    </div>

    <div class="modal-footer">

        ${this.footer}

    </div>

</div>

`);

        this.bindEvents();

    }

    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        const close =

            this.element.querySelector(

                ".modal-close"

            );

        if (close) {

            close.onclick = () =>

                this.close();

        }

    }

    /* ======================================================
     * Content
     * ====================================================== */

    setTitle(title) {

        this.title = title;

        this.refresh();

    }

    setContent(html) {

        this.content = html;

        this.refresh();

    }

    setFooter(html) {

        this.footer = html;

        this.refresh();

    }

    /* ======================================================
     * Open / Close
     * ====================================================== */

    open() {

        this.opened = true;

        this.show();

    }

    close() {

        this.opened = false;

        this.hide();

        this.onCancel?.();

    }

    isOpen() {

        return this.opened;

    }

    /* ======================================================
     * Confirmation
     * ====================================================== */

    confirm() {

        this.onConfirm?.();

        this.close();

    }

    setConfirm(callback) {

        this.onConfirm = callback;

    }

    setCancel(callback) {

        this.onCancel = callback;

    }

    /* ======================================================
     * Options
     * ====================================================== */

    setClosable(value = true) {

        this.closable = value;

        this.refresh();

    }

}
