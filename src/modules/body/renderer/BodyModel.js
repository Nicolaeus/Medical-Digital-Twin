/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModel.js
 * Human Body Model
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export default class BodyModel {

    constructor(scene) {

        this.scene = scene;

        this.root = null;

        this.meshes = [];

        this.material = null;

        this.visible = true;

        this.opacity = 0.35;

    }

    /* ======================================================
     * Load Model
     * ====================================================== */

    async load(path = "assets/models/body.glb") {

        const result = await BABYLON.SceneLoader.ImportMeshAsync(

            "",

            "",

            path,

            this.scene

        );

        this.meshes = result.meshes;

        this.root = result.meshes[0];

        this.createMaterial();

        this.applyMaterial();

    }

    /* ======================================================
     * Material
     * ====================================================== */

    createMaterial() {

        this.material = new BABYLON.StandardMaterial(

            "BodyMaterial",

            this.scene

        );

        this.material.diffuseColor =

            new BABYLON.Color3(

                0.55,

                0.85,

                1.0

            );

        this.material.emissiveColor =

            new BABYLON.Color3(

                0.15,

                0.35,

                0.45

            );

        this.material.alpha = this.opacity;

        this.material.backFaceCulling = false;

    }

    /* ======================================================
     * Apply Material
     * ====================================================== */

    applyMaterial() {

        this.meshes.forEach(mesh => {

            if (

                mesh instanceof BABYLON.Mesh

            ) {

                mesh.material = this.material;

            }

        });

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        this.meshes.forEach(

            mesh => mesh.setEnabled(true)

        );

    }

    hide() {

        this.visible = false;

        this.meshes.forEach(

            mesh => mesh.setEnabled(false)

        );

    }

    toggle() {

        this.visible ?

            this.hide()

            :

            this.show();

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(value) {

        this.opacity = value;

        if (this.material) {

            this.material.alpha = value;

        }

    }

    /* ======================================================
     * Selection
     * ====================================================== */

    getOrgan(name) {

        return this.meshes.find(

            mesh =>

                mesh.name.toLowerCase() ===

                name.toLowerCase()

        );

    }

    highlight(name) {

        const organ = this.getOrgan(name);

        if (!organ) {

            return;

        }

        organ.renderOutline = true;

        organ.outlineWidth = 0.08;

        organ.outlineColor =

            BABYLON.Color3.Cyan();

    }

    clearSelection() {

        this.meshes.forEach(mesh => {

            mesh.renderOutline = false;

        });

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getRoot() {

        return this.root;

    }

    getMeshes() {

        return this.meshes;

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.meshes.forEach(mesh => {

            mesh.dispose();

        });

        this.material?.dispose();

        this.meshes = [];

        this.root = null;

    }

}
