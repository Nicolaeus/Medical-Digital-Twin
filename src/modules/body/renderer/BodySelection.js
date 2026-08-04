/**
 * ==========================================================
 * Medical Digital Twin
 * BodySelection.js
 * Organ Selection Manager
 * ==========================================================
 */

import Store from "../../../core/store.js";

export default class BodySelection {

    constructor({

        model,

        camera

    } = {}) {

        this.model = model;

        this.camera = camera;

        this.selected = null;

    }

    /* ======================================================
     * Selection
     * ====================================================== */

    select(name) {

        if (!name) {

            return;

        }

        if (this.selected === name) {

            return;

        }

        this.clear();

        this.selected = name;

        this.model?.highlight(name);

        Store.set(

            "body.selected",

            name

        );

    }

    /* ======================================================
     * Clear
     * ====================================================== */

    clear() {

        this.model?.clearSelection();

        this.selected = null;

        Store.set(

            "body.selected",

            null

        );

    }

    /* ======================================================
     * Focus
     * ====================================================== */

    focus(name = this.selected) {

        if (!name) {

            return;

        }

        const organ =

            this.model?.getOrgan(name);

        if (!organ) {

            return;

        }

        this.camera?.focus(

            organ.getAbsolutePosition()

        );

    }

    /* ======================================================
     * Helpers
     * ====================================================== */

    hasSelection() {

        return this.selected !== null;

    }

    isSelected(name) {

        return this.selected === name;

    }

    getSelected() {

        return this.selected;

    }

    /* ======================================================
     * Toggle
     * ====================================================== */

    toggle(name) {

        if (

            this.selected === name

        ) {

            this.clear();

            return;

        }

        this.select(name);

    }

}
