/**
 * ==========================================================
 * Medical Digital Twin
 * BaseComponent.js
 * Base UI Component
 * ==========================================================
 */

import Store from "../../store.js";

export default class BaseComponent {

    constructor(options = {}) {

        this.id =
            options.id ||
            crypto.randomUUID();

        this.element = null;

        this.parent = null;

        this.initialized = false;

        this.visible = true;

        this.watchers = [];

    }

    /* ======================================================
     * Lifecycle
     * ====================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        await this.render();

        this.bindEvents();

        this.watchStore();

        this.initialized = true;

    }

    async render() {

        throw new Error(
            `${this.constructor.name}.render() must be implemented.`
        );

    }

    bindEvents() {

    }

    watchStore() {

    }

    refresh() {

    }

    /* ======================================================
     * Mount
     * ====================================================== */

    mount(parent) {

        if (typeof parent === "string") {

            parent =
                document.querySelector(
                    parent
                );

        }

        if (!parent) {

            throw new Error(
                "Parent element not found."
            );

        }

        this.parent = parent;

        if (this.element) {

            parent.appendChild(
                this.element
            );

        }

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        if (this.element) {

            this.element.hidden = false;

        }

    }

    hide() {

        this.visible = false;

        if (this.element) {

            this.element.hidden = true;

        }

    }

    toggle() {

        this.visible
            ? this.hide()
            : this.show();

    }

    /* ======================================================
     * HTML
     * ====================================================== */

    setHTML(html) {

        if (!this.element) {

            return;

        }

        this.element.innerHTML =
            html;

    }

    /* ======================================================
     * CSS Classes
     * ====================================================== */

    addClass(...classes) {

        this.element?.classList.add(
            ...classes
        );

    }

    removeClass(...classes) {

        this.element?.classList.remove(
            ...classes
        );

    }

    hasClass(className) {

        return this.element
            ?.classList
            .contains(
                className
            );

    }

    /* ======================================================
     * DOM
     * ====================================================== */

    $(selector) {

        return this.element
            ?.querySelector(
                selector
            );

    }

    $$(selector) {

        return [
            ...(this.element
                ?.querySelectorAll(
                    selector
                ) || [])
        ];

    }

    /* ======================================================
     * Store Watchers
     * ====================================================== */

    addWatcher(id) {

        if (
            id === undefined ||
            id === null
        ) {

            return;

        }

        this.watchers.push(
            id
        );

    }

    clearWatchers() {

        this.watchers.forEach(
            watcherId => {

                Store.unwatch(
                    watcherId
                );

            }
        );

        this.watchers = [];

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.clearWatchers();

        this.element?.remove();

        this.element = null;

        this.parent = null;

        this.initialized = false;

    }

}
