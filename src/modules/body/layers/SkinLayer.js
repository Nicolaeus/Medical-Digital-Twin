/**
 * ==========================================================
 * Medical Digital Twin
 * SkinLayer.js
 * Skin Layer
 * ==========================================================
 */

export default class SkinLayer {

    constructor(model = null) {

        this.model = model;

        this.visible = true;

        this.opacity = 1.0;

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

        this.model = null;

    }

}
