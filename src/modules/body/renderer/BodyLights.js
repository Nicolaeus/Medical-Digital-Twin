/**
 * ==========================================================
 * Medical Digital Twin
 * BodyLights.js
 * Scene Lighting
 * ==========================================================
 */

export default class BodyLights {

    constructor(scene) {

        this.scene = scene;

        this.hemispheric = null;

        this.directional = null;

        this.fill = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.createHemispheric();

        this.createDirectional();

        this.createFillLight();

    }

    /* ======================================================
     * Main Light
     * ====================================================== */

    createHemispheric() {

        this.hemispheric = new BABYLON.HemisphericLight(

            "HemisphericLight",

            new BABYLON.Vector3(

                0,

                1,

                0

            ),

            this.scene

        );

        this.hemispheric.intensity = 1.2;

    }

    /* ======================================================
     * Directional Light
     * ====================================================== */

    createDirectional() {

        this.directional = new BABYLON.DirectionalLight(

            "DirectionalLight",

            new BABYLON.Vector3(

                -1,

                -2,

                -1

            ),

            this.scene

        );

        this.directional.position =

            new BABYLON.Vector3(

                5,

                8,

                5

            );

        this.directional.intensity = 0.6;

    }

    /* ======================================================
     * Fill Light
     * ====================================================== */

    createFillLight() {

        this.fill = new BABYLON.PointLight(

            "FillLight",

            new BABYLON.Vector3(

                -4,

                3,

                -4

            ),

            this.scene

        );

        this.fill.intensity = 0.35;

    }

    /* ======================================================
     * Intensity
     * ====================================================== */

    setIntensity(value) {

        if (this.hemispheric) {

            this.hemispheric.intensity = value;

        }

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    enable() {

        this.scene.lights.forEach(

            light => light.setEnabled(true)

        );

    }

    disable() {

        this.scene.lights.forEach(

            light => light.setEnabled(false)

        );

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.hemispheric?.dispose();

        this.directional?.dispose();

        this.fill?.dispose();

    }

}
