/**
 * ==========================================================
 * Medical Digital Twin
 * LayerManager.js
 * Anatomy Layer Manager
 * ==========================================================
 */

export default class LayerManager {

    constructor() {

        this.layers = new Map();

    }

    /* ======================================================
     * Register
     * ====================================================== */

    register(name, layer) {

        this.layers.set(

            name,

            layer

        );

    }

    /* ======================================================
     * Remove
     * ====================================================== */

    unregister(name) {

        this.layers.delete(name);

    }

    /* ======================================================
     * Access
     * ====================================================== */

    get(name) {

        return this.layers.get(name);

    }

    has(name) {

        return this.layers.has(name);

    }

    names() {

        return [

            ...this.layers.keys()

        ];

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show(name) {

        this.layers

            .get(name)

            ?.show();

    }

    hide(name) {

        this.layers

            .get(name)

            ?.hide();

    }

    toggle(name) {

        this.layers

            .get(name)

            ?.toggle();

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(

        name,

        value

    ) {

        this.layers

            .get(name)

            ?.setOpacity(value);

    }

    /* ======================================================
     * Global
     * ====================================================== */

    showAll() {

        this.layers.forEach(

            layer => layer.show()

        );

    }

    hideAll() {

        this.layers.forEach(

            layer => layer.hide()

        );

    }

    toggleAll() {

        this.layers.forEach(

            layer => layer.toggle()

        );

    }

    /* ======================================================
     * Preset
     * ====================================================== */
    activatePreset(name) {
        
            //
            // TODO
            //
        
        }

    /* ======================================================
     * Reset
     * ====================================================== */

    reset() {

        this.showAll();

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.layers.forEach(

            layer => layer.destroy?.()

        );

        this.layers.clear();

    }

}
