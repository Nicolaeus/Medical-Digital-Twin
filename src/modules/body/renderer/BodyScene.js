/**
 * ==========================================================
 * Medical Digital Twin
 * BodyScene.js
 * Babylon Scene
 * ==========================================================
 */

import BodyCamera from "./BodyCamera.js";
import BodyLights from "./BodyLights.js";

export default class BodyScene {

    constructor(engine, canvas) {

        this.engine = engine;

        this.canvas = canvas;

        this.scene = null;

        this.camera = null;

        this.lights = null;

        this.model = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.scene = new BABYLON.Scene(

            this.engine

        );

        this.scene.clearColor =

            new BABYLON.Color4(

                0,

                0,

                0,

                0

            );

        this.createCamera();

        this.createLights();

        await this.loadModel();

        this.startAnimation();

    }

    /* ======================================================
     * Camera
     * ====================================================== */

    createCamera() {

        this.camera = new BodyCamera(

            this.scene,

            this.canvas

        );

        this.camera.init();

    }

    /* ======================================================
     * Lights
     * ====================================================== */

    createLights() {

        this.lights = new BodyLights(

            this.scene

        );

        this.lights.init();

    }

    /* ======================================================
     * Model
     * ====================================================== */

    async loadModel() {

        //
        // MVP
        //
        // On ajoutera le GLB plus tard.
        //

    }

    /* ======================================================
     * Animation
     * ====================================================== */

    startAnimation() {

        //
        // Rotation automatique
        // Respiration
        // Battement du cœur
        //

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

    }

    /* ======================================================
     * Render
     * ====================================================== */

    render() {

        this.scene.render();

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.scene?.dispose();

    }

}
