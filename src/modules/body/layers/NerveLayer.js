/**
 * ==========================================================
 * Medical Digital Twin
 * NerveLayer.js
 * Nervous System Layer
 * ==========================================================
 */

export default class NerveLayer {

    constructor(model = null) {

        this.model = model;

        this.visible = false;

        this.opacity = 1.0;

        this.selected = null;

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        this.model?.show();

    }

    hide() {

        this.visible = false;

        this.model?.hide();

    }

    toggle() {

        this.visible ?

            this.hide()

            :

            this.show();

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(value) {

        this.opacity = value;

        this.model?.setOpacity(value);

    }

    getOpacity() {

        return this.opacity;

    }

    /* ======================================================
     * Selection
     * ====================================================== */

    select(name) {

        this.selected = name;

        this.model?.highlight(name);

    }

    clearSelection() {

        this.selected = null;

        this.model?.clearSelection();

    }

    getSelected() {

        return this.selected;

    }

    /* ======================================================
     * State
     * ====================================================== */

    isVisible() {

        return this.visible;

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getModel() {

        return this.model;

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.clearSelection();

        this.model = null;

    }

}
