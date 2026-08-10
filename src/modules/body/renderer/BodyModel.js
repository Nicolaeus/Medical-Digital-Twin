/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModel.js
 * Interactive Human Body Model
 * ==========================================================
 */

export default class BodyModel {

    constructor(scene) {

        this.scene = scene;

        this.root = null;

        this.meshes = [];

        this.material = null;

        this.manifest = null;

        this.entities = new Map();

        this.meshEntities = new Map();

        this.visible = true;

        this.opacity = 1.0;

        this.loaded = false;

    }

    /* ======================================================
     * Load
     * ====================================================== */

    async load(

        modelPath =
            "src/modules/body/assets/models/body_twin/body_twin.glb",

        manifestPath =
            "src/modules/body/assets/models/body_twin/body_twin_manifest.json"

    ) {

        await this.loadManifest(

            manifestPath

        );

        const result =

            await BABYLON.SceneLoader.ImportMeshAsync(

                "",

                "",

                modelPath,

                this.scene

            );

        this.meshes = result.meshes.filter(

            mesh => mesh instanceof BABYLON.Mesh

        );

        this.root =

            result.meshes.find(

                mesh =>

                    mesh.name === "__root__"

            )

            || result.meshes[0];

        this.buildEntityIndex();

        this.loaded = true;

        return this;

    }

    /* ======================================================
     * Manifest
     * ====================================================== */

    async loadManifest(path) {

        const response = await fetch(path);

        if (!response.ok) {

            throw new Error(

                `Unable to load Body Twin manifest: ${path}`

            );

        }

        this.manifest =

            await response.json();

        this.indexManifestEntities();

    }

    /* ======================================================
     * Manifest Index
     * ====================================================== */

    indexManifestEntities() {

        this.entities.clear();

        const entities =

            this.manifest?.entities || {};

        Object.entries(entities).forEach(

            ([id, entity]) => {

                this.entities.set(

                    id,

                    entity

                );

            }

        );

    }

    /* ======================================================
     * Mesh → Entity Index
     * ====================================================== */

    buildEntityIndex() {

        this.meshEntities.clear();

        this.meshes.forEach(mesh => {

            const entity =

                this.findEntityForMesh(

                    mesh.name

                );

            if (entity) {

                this.meshEntities.set(

                    mesh.name,

                    entity

                );

            }

        });

    }

    findEntityForMesh(meshName) {

        for (const entity of this.entities.values()) {

            const objects =

                entity.objects || [];

            const match = objects.find(

                object =>

                    object.object_name === meshName

            );

            if (match) {

                return entity;

            }

        }

        return null;

    }

    /* ======================================================
     * Entity Access
     * ====================================================== */

    getEntity(id) {

        return this.entities.get(id) || null;

    }

    getEntityForMesh(meshOrName) {

        const name =

            typeof meshOrName === "string"

                ? meshOrName

                : meshOrName?.name;

        if (!name) {

            return null;

        }

        return (

            this.meshEntities.get(name)

            || this.findEntityForMesh(name)

        );

    }

    getEntities() {

        return Array.from(

            this.entities.values()

        );

    }

    /* ======================================================
     * Mesh Access
     * ====================================================== */

    getOrgan(name) {

        return this.meshes.find(

            mesh =>

                mesh.name.toLowerCase() ===

                name.toLowerCase()

        );

    }

    getMeshes() {

        return this.meshes;

    }

    getRoot() {

        return this.root;

    }

    /* ======================================================
     * Bounds
     * ====================================================== */

    getBounds() {

        if (!this.meshes.length) {

            return null;

        }

        let min = null;

        let max = null;

        this.meshes.forEach(mesh => {

            if (!mesh.getBoundingInfo) {

                return;

            }

            const bounding =

                mesh.getBoundingInfo()

                    .boundingBox;

            const meshMin =

                bounding.minimumWorld;

            const meshMax =

                bounding.maximumWorld;

            if (!min) {

                min = meshMin.clone();

                max = meshMax.clone();

                return;

            }

            min = BABYLON.Vector3.Minimize(

                min,

                meshMin

            );

            max = BABYLON.Vector3.Maximize(

                max,

                meshMax

            );

        });

        if (!min || !max) {

            return null;

        }

        const center =

            min.add(max)

                .scale(0.5);

        const size =

            max.subtract(min);

        return {

            min,

            max,

            center,

            size,

            radius: size.length() / 2

        };

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

        this.visible

            ? this.hide()

            : this.show();

    }

    /* ======================================================
     * Opacity
     * ====================================================== */

    setOpacity(value) {

        this.opacity = value;

        if (!this.material) {

            return;

        }

        this.material.alpha = value;

    }

    /* ======================================================
     * Selection
     * ====================================================== */

    highlight(name) {

        this.clearSelection();

        const mesh =

            this.getOrgan(name);

        if (!mesh) {

            return;

        }

        mesh.renderOutline = true;

        mesh.outlineWidth = 0.04;

        mesh.outlineColor =

            BABYLON.Color3.FromHexString(

                "#00A8FF"

            );

    }

    highlightEntity(entityId) {

        this.clearSelection();

        const entity =

            this.getEntity(entityId);

        if (!entity) {

            return;

        }

        const names = new Set(

            (entity.objects || [])

                .map(object => object.object_name)

        );

        this.meshes.forEach(mesh => {

            if (names.has(mesh.name)) {

                mesh.renderOutline = true;

                mesh.outlineWidth = 0.04;

                mesh.outlineColor =

                    BABYLON.Color3.FromHexString(

                        "#00A8FF"

                    );

            }

        });

    }

    clearSelection() {

        this.meshes.forEach(mesh => {

            mesh.renderOutline = false;

        });

    }

    /* ======================================================
     * Dispose
     * ====================================================== */

    destroy() {

        this.meshes.forEach(mesh => {

            mesh.dispose();

        });

        this.material?.dispose();

        this.meshes = [];

        this.entities.clear();

        this.meshEntities.clear();

        this.root = null;

        this.manifest = null;

        this.loaded = false;

    }

}