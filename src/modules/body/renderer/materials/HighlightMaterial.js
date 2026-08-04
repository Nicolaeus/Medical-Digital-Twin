/**
 * ==========================================================
 * Medical Digital Twin
 * HighlightMaterial.js
 * Selected Organ Material
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";

export default class HighlightMaterial {

    constructor(scene) {

        this.scene = scene;

        this.material = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.material = new BABYLON.PBRMaterial(

            "HighlightMaterial",

            this.scene

        );

        this.material.albedoColor =

            new BABYLON.Color3(

                1.0,

                0.82,

                0.15

            );

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.75,

                0.55,

                0.05

            );

        this.material.alpha = 1.0;

        this.material.metallic = 0.0;

        this.material.roughness = 0.20;

        this.material.backFaceCulling = false;

    }

    /* ======================================================
     * Apply
     * ====================================================== */

    apply(mesh) {

        if (!mesh) {

            return;

        }

        mesh.material = this.material;

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
