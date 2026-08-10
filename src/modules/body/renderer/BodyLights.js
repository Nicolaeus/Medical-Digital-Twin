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

        this.rim = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.createHemispheric();

        this.createDirectional();

        this.createFillLight();

        this.createRimLight();

    }

    /* ======================================================
     * Ambient Light
     * ====================================================== */

    createHemispheric() {

        this.hemispheric =

            new BABYLON.HemisphericLight(

                "BodyAmbientLight",

                new BABYLON.Vector3(

                    0,

                    1,

                    0

                ),

                this.scene

            );

        /*
         * Reduced considerably compared with the previous
         * 1.2 intensity.
         *
         * The ambient light should reveal the anatomy without
         * flattening all the volumes.
         */

        this.hemispheric.intensity = 0.45;

        /*
         * Slightly warm upper light.
         */

        this.hemispheric.diffuse =

            new BABYLON.Color3(

                1.0,

                0.96,

                0.90

            );

        /*
         * Cool lower/environment contribution.
         */

        this.hemispheric.groundColor =

            new BABYLON.Color3(

                0.20,

                0.30,

                0.42

            );

    }

    /* ======================================================
     * Main Directional Light
     * ====================================================== */

    createDirectional() {

        this.directional =

            new BABYLON.DirectionalLight(

                "BodyKeyLight",

                new BABYLON.Vector3(

                    -0.65,

                    -1.0,

                    -0.55

                ),

                this.scene

            );

        this.directional.position =

            new BABYLON.Vector3(

                5,

                8,

                5

            );

        /*
         * Main sculpting light.
         */

        this.directional.intensity = 0.85;

        /*
         * Slightly warm clinical light.
         */

        this.directional.diffuse =

            new BABYLON.Color3(

                1.0,

                0.93,

                0.84

            );

        this.directional.specular =

            new BABYLON.Color3(

                1.0,

                0.95,

                0.90

            );

    }

    /* ======================================================
     * Fill Light
     * ====================================================== */

    createFillLight() {

        this.fill =

            new BABYLON.PointLight(

                "BodyFillLight",

                new BABYLON.Vector3(

                    -5,

                    3,

                    -4

                ),

                this.scene

            );

        /*
         * Lower intensity so that the directional light can
         * actually create anatomical volume.
         */

        this.fill.intensity = 0.22;

        /*
         * Cool blue fill.
         */

        this.fill.diffuse =

            new BABYLON.Color3(

                0.55,

                0.72,

                0.95

            );

        this.fill.specular =

            new BABYLON.Color3(

                0.35,

                0.50,

                0.70

            );

    }

    /* ======================================================
     * Rim Light
     * ====================================================== */

    createRimLight() {

        this.rim =

            new BABYLON.DirectionalLight(

                "BodyRimLight",

                new BABYLON.Vector3(

                    0.75,

                    -0.35,

                    0.85

                ),

                this.scene

            );

        this.rim.position =

            new BABYLON.Vector3(

                -4,

                5,

                -6

            );

        /*
         * Very restrained rim light.
         *
         * Its job is silhouette separation, not illumination.
         */

        this.rim.intensity = 0.28;

        this.rim.diffuse =

            new BABYLON.Color3(

                0.45,

                0.68,

                1.0

            );

        this.rim.specular =

            new BABYLON.Color3(

                0.30,

                0.55,

                0.90

            );

    }

    /* ======================================================
     * Intensity
     * ====================================================== */

    setIntensity(value) {

        if (this.hemispheric) {

            this.hemispheric.intensity =

                value * 0.45;

        }

        if (this.directional) {

            this.directional.intensity =

                value * 0.85;

        }

        if (this.fill) {

            this.fill.intensity =

                value * 0.22;

        }

        if (this.rim) {

            this.rim.intensity =

                value * 0.28;

        }

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    enable() {

        this.scene.lights.forEach(

            light => {

                light.setEnabled(true);

            }

        );

    }

    disable() {

        this.scene.lights.forEach(

            light => {

                light.setEnabled(false);

            }

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        /*
         * Reserved for dynamic lighting profiles.
         */

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.hemispheric?.dispose();

        this.directional?.dispose();

        this.fill?.dispose();

        this.rim?.dispose();

        this.hemispheric = null;

        this.directional = null;

        this.fill = null;

        this.rim = null;

    }

}
