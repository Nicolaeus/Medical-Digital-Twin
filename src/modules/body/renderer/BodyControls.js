/**
 * ==========================================================
 * Medical Digital Twin
 * BodyControls.js
 * Body Engine Controller
 * ==========================================================
 */

export default class BodyControls {

    constructor({

        camera,

        layers,

        selection,

        animation

    } = {}) {

        this.camera = camera;

        this.layers = layers;

        this.selection = selection;

        this.animation = animation;

    }

    /* ======================================================
     * Camera
     * ====================================================== */

    front() {

        this.camera?.front();

    }

    back() {

        this.camera?.back();

    }

    left() {

        this.camera?.left();

    }

    right() {

        this.camera?.right();

    }

    top() {

        this.camera?.top();

    }

    resetView() {

        this.camera?.reset();

    }

    /* ======================================================
     * Rotation
     * ====================================================== */

    enableRotation() {

        this.camera?.enableAutoRotate();

    }

    disableRotation() {

        this.camera?.disableAutoRotate();

    }

    toggleRotation() {

        this.camera?.toggleAutoRotate();

    }

    /* ======================================================
     * Layers
     * ====================================================== */

    show(layer) {

        this.layers?.show(layer);

    }

    hide(layer) {

        this.layers?.hide(layer);

    }

    toggle(layer) {

        this.layers?.toggle(layer);

    }

    /* ======================================================
     * Selection
     * ====================================================== */

    select(name) {

        this.selection?.select(name);

    }

    clearSelection() {

        this.selection?.clear();

    }

    focus(name) {

        this.selection?.focus(name);

    }

    /* ======================================================
     * Animation
     * ====================================================== */

    play(name) {

        this.animation?.play(name);

    }

    stop(name) {

        this.animation?.stop(name);

    }

    pause(name) {

        this.animation?.pause(name);

    }

    resume(name) {

        this.animation?.resume(name);

    }

    /* ======================================================
     * Ghost Mode
     * ====================================================== */

    enableGhostMode() {

        this.layers?.show("ghost");

    }

    disableGhostMode() {

        this.layers?.hide("ghost");

    }

    /* ======================================================
     * Anatomy Presets
     * ====================================================== */

    showSkin() {

        this.layers?.show("skin");

    }

    showSkeleton() {

        this.layers?.show("skeleton");

    }

    showMuscles() {

        this.layers?.show("muscles");

    }

    showOrgans() {

        this.layers?.show("organs");

    }

    showVessels() {

        this.layers?.show("vessels");

    }

    showNerves() {

        this.layers?.show("nerves");

    }

    showDevices() {

        this.layers?.show("devices");

    }

    showImaging() {

        this.layers?.show("imaging");

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(value) {

        this.layers?.setOpacity(value);

    }

}
