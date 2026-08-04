/**
 * ==========================================================
 * Medical Digital Twin
 * BodyMaterial.js
 * Human Body Material
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";

export default class BodyMaterial {

    constructor(scene) {

        this.scene = scene;

        this.material = null;

        this.opacity = 0.35;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.material = new BABYLON.PBRMaterial(

            "BodyMaterial",

            this.scene

        );

        /*
        ------------------------------------------------------
        Appearance
        ------------------------------------------------------
        */

        this.material.albedoColor =

            new BABYLON.Color3(

                0.72,

                0.90,

                1.00

            );

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.08,

                0.18,

                0.28

            );

        this.material.alpha = this.opacity;

        /*
        ------------------------------------------------------
        Transparency
        ------------------------------------------------------
        */

        this.material.transparencyMode =

            BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

        this.material.backFaceCulling = false;

        /*
        ------------------------------------------------------
        Reflection
        ------------------------------------------------------
        */

        this.material.metallic = 0.0;

        this.material.roughness = 0.15;

    }

    /* ======================================================
     * Apply
     * ====================================================== */

    apply(meshes = []) {

        meshes.forEach(mesh => {

            mesh.material = this.material;

        });

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(value) {

        this.opacity = value;

        this.material.alpha = value;

    }

    getOpacity() {

        return this.opacity;

    }

    /* ======================================================
     * Colors
     * ====================================================== */

    setColor(color) {

        this.material.albedoColor = color;

    }

    setEmissive(color) {

        this.material.emissiveColor = color;

    }

    /* ======================================================
     * Presets
     * ====================================================== */

    medical() {

        this.setColor(

            new BABYLON.Color3(

                0.72,

                0.90,

                1.00

            )

        );

        this.setOpacity(0.35);

    }

    ghost() {

        this.setColor(

            new BABYLON.Color3(

                0.60,

                0.85,

                1.00

            )

        );

        this.setOpacity(0.18);

    }

    xray() {

        this.setColor(

            new BABYLON.Color3(

                0.95,

                0.98,

                1.00

            )

        );

        this.setOpacity(0.08);

    }

    hidden() {

        this.setOpacity(0);

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getMaterial() {

        return this.material;

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.material?.dispose();

    }

}
