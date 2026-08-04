/**
 * ==========================================================
 * Medical Digital Twin
 * Widget.js
 * Base Widget Component
 * ==========================================================
 */

import BaseComponent from "./BaseComponent.js";

export default class Widget extends BaseComponent {

    constructor(options = {}) {

        super(options);

        this.title = options.title ?? "";

        this.icon = options.icon ?? "";

        this.loading = false;

        this.visible = true;

        this.enabled = true;

    }

    /* ======================================================
     * Header
     * ====================================================== */

    setTitle(title) {

        this.title = title;

        this.refresh();

    }

    getTitle() {

        return this.title;

    }

    setIcon(icon) {

        this.icon = icon;

        this.refresh();

    }

    getIcon() {

        return this.icon;

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        this.element?.classList.remove("hidden");

    }

    hide() {

        this.visible = false;

        this.element?.classList.add("hidden");

    }

    toggle() {

        this.visible ?

            this.hide()

            :

            this.show();

    }

    isVisible() {

        return this.visible;

    }

    /* ======================================================
     * State
     * ====================================================== */

    enable() {

        this.enabled = true;

        this.element?.removeAttribute(

            "disabled"

        );

    }

    disable() {

        this.enabled = false;

        this.element?.setAttribute(

            "disabled",

            ""

        );

    }

    isEnabled() {

        return this.enabled;

    }

    /* ======================================================
     * Loading
     * ====================================================== */

    startLoading() {

        this.loading = true;

        this.element?.classList.add(

            "loading"

        );

    }

    stopLoading() {

        this.loading = false;

        this.element?.classList.remove(

            "loading"

        );

    }

    isLoading() {

        return this.loading;

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        //
        // Implemented by subclasses
        //

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.element?.remove();

        this.element = null;

    }

}
