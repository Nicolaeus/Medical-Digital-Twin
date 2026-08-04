/**
 * ==========================================================
 * Medical Digital Twin
 * GhostMaterial.js
 * Ghost / Holographic Material
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";

export default class GhostMaterial {

    constructor(scene) {

        this.scene = scene;

        this.material = null;

        this.opacity = 0.15;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.material = new BABYLON.PBRMaterial(

            "GhostMaterial",

            this.scene

        );

        this.material.albedoColor =

            new BABYLON.Color3(

                0.55,

                0.85,

                1.00

            );

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.10,

                0.25,

                0.35

            );

        this.material.alpha = this.opacity;

        this.material.metallic = 0.0;

        this.material.roughness = 0.05;

        this.material.backFaceCulling = false;

        this.material.transparencyMode =

            BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

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
