/**
 * ==========================================================
 * Medical Digital Twin
 * OrganMaterial.js
 * Generic Organ Material
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";

export default class OrganMaterial {

    constructor(scene) {

        this.scene = scene;

        this.material = null;

        this.opacity = 0.95;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.material = new BABYLON.PBRMaterial(

            "OrganMaterial",

            this.scene

        );

        /*
        ------------------------------------------------------
        Appearance
        ------------------------------------------------------
        */

        this.material.albedoColor =

            new BABYLON.Color3(

                0.82,

                0.18,

                0.22

            );

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.15,

                0.02,

                0.02

            );

        this.material.alpha = this.opacity;

        this.material.metallic = 0.0;

        this.material.roughness = 0.55;

        this.material.backFaceCulling = false;

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
     * Generic Color
     * ====================================================== */

    setColor(color) {

        this.material.albedoColor = color;

    }

    /* ======================================================
     * Organ Presets
     * ====================================================== */

    heart() {

        this.material.albedoColor =

            new BABYLON.Color3(

                0.82,

                0.18,

                0.22

            );

    }

    lungs() {

        this.material.albedoColor =

            new BABYLON.Color3(

                0.65,

                0.88,

                1.00

            );

    }

    liver() {

        this.material.albedoColor =

            new BABYLON.Color3(

                0.58,

                0.22,

                0.14

            );

    }

    brain() {

        this.material.albedoColor =

            new BABYLON.Color3(

                0.96,

                0.88,

                0.82

            );

    }

    kidneys() {

        this.material.albedoColor =

            new BABYLON.Color3(

                0.55,

                0.08,

                0.18

            );

    }

    /* ======================================================
     * Highlight
     * ====================================================== */

    highlight() {

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.6,

                0.2,

                0.2

            );

    }

    clearHighlight() {

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.15,

                0.02,

                0.02

            );

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
