/**
 * ==========================================================
 * Medical Digital Twin
 * ImagingLayer.js
 * Medical Imaging Layer
 * ==========================================================
 */

export default class ImagingLayer {

    constructor(model = null) {

        this.model = model;

        this.visible = false;

        this.opacity = 1.0;

        this.dataset = null;

    }

    /* ======================================================
     * Dataset
     * ====================================================== */

    load(dataset) {

        this.dataset = dataset;

        this.model?.load?.(dataset);

    }

    unload() {

        this.dataset = null;

        this.model?.clear?.();

    }

    hasDataset() {

        return this.dataset !== null;

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

    getDataset() {

        return this.dataset;

    }

    getModel() {

        return this.model;

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.unload();

        this.model = null;

    }

}
