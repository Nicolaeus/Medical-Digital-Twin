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

        this.skinMeshes = new Set();

        this.clonedMaterials = new Set();

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

        this.meshes =
            result.meshes.filter(
                mesh =>
                    mesh instanceof BABYLON.Mesh
            );

        this.root =
            result.meshes.find(
                mesh =>
                    mesh.name === "__root__"
            )
            ||
            result.meshes[0];

        this.buildEntityIndex();

        this.buildSkinIndex();

        this.loaded = true;

        return this;

    }

    /* ======================================================
     * Manifest
     * ====================================================== */

    async loadManifest(path) {

        const response =
            await fetch(path);

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

        for (
            const entity
            of this.entities.values()
        ) {

            const objects =
                entity.objects || [];

            const match =
                objects.find(
                    object =>
                        object.object_name ===
                        meshName
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

        return (
            this.entities.get(id)
            ||
            null
        );

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
            ||
            this.findEntityForMesh(name)
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
     * Skin / Surface Index
     * ====================================================== */

    buildSkinIndex() {

        this.skinMeshes.clear();

        this.meshes.forEach(mesh => {

            if (
                this.isLikelySkinMesh(mesh)
            ) {

                this.skinMeshes.add(mesh);

            }

        });

        /*
         * Current Body Twin surface export is primarily
         * a skin/body surface.
         *
         * If no explicit skin meshes can be identified,
         * use the imported surface meshes as fallback.
         */

        if (
            this.skinMeshes.size === 0
        ) {

            this.meshes.forEach(mesh => {

                if (
                    this.isRenderableMesh(mesh)
                ) {

                    this.skinMeshes.add(mesh);

                }

            });

        }

    }

    isRenderableMesh(mesh) {

        return (
            mesh instanceof BABYLON.Mesh &&
            mesh.geometry !== null
        );

    }

    isLikelySkinMesh(mesh) {

        if (!mesh) {

            return false;

        }

        const meshName =
            String(
                mesh.name || ""
            ).toLowerCase();

        const materialName =
            String(
                mesh.material?.name || ""
            ).toLowerCase();

        const combined =
            `${meshName} ${materialName}`;

        /*
         * Strong skin / body surface identifiers.
         */

        const skinTerms = [

            "skin",
            "epiderm",
            "dermis",
            "cutaneous",
            "integument",
            "body_surface",
            "body surface",
            "surface",
            "external",
            "outer",
            "body"

        ];

        /*
         * Explicitly avoid obvious internal anatomy.
         */

        const internalTerms = [

            "brain",
            "heart",
            "lung",
            "liver",
            "kidney",
            "spleen",
            "stomach",
            "intestine",
            "bone",
            "skull",
            "vertebra",
            "arter",
            "vein",
            "nerve",
            "muscle"

        ];

        const hasSkinTerm =
            skinTerms.some(
                term =>
                    combined.includes(term)
            );

        const hasInternalTerm =
            internalTerms.some(
                term =>
                    combined.includes(term)
            );

        if (
            hasSkinTerm &&
            !hasInternalTerm
        ) {

            return true;

        }

        return false;

    }

    /* ======================================================
     * Skin Appearance
     * ====================================================== */

    applySkinAppearance(color) {

        if (!color) {

            return;

        }

        /*
         * Make sure the skin index exists.
         */

        if (
            this.skinMeshes.size === 0
        ) {

            this.buildSkinIndex();

        }

        const skinColor =
            this.normalizeColor(
                color
            );

        if (!skinColor) {

            console.warn(
                "BodyModel: invalid skin color."
            );

            return;

        }

        this.skinMeshes.forEach(
            mesh => {

                this.applyColorToMesh(
                    mesh,
                    skinColor
                );

            }
        );

    }

    /* ======================================================
     * Apply Color To Mesh
     * ====================================================== */

    applyColorToMesh(
        mesh,
        color
    ) {

        if (
            !mesh ||
            !mesh.material
        ) {

            return;

        }

        const material =
            this.prepareMaterial(
                mesh
            );

        if (!material) {

            return;

        }

        /*
         * MultiMaterial
         */

        if (
            material instanceof
            BABYLON.MultiMaterial
        ) {

            material.subMaterials.forEach(
                subMaterial => {

                    this.applyColorToMaterial(
                        subMaterial,
                        color
                    );

                }
            );

            return;

        }

        /*
         * Standard / PBR / compatible material
         */

        this.applyColorToMaterial(
            material,
            color
        );

    }

    /* ======================================================
     * Prepare Material
     * ====================================================== */

    prepareMaterial(mesh) {

        const original =
            mesh.material;

        if (!original) {

            return null;

        }

        /*
         * MultiMaterial
         */

        if (
            original instanceof
            BABYLON.MultiMaterial
        ) {

            if (
                !this.clonedMaterials.has(
                    original
                )
            ) {

                const clone =
                    original.clone(
                        `${original.name}_skin`
                    );

                clone.subMaterials =
                    original.subMaterials.map(
                        subMaterial => {

                            if (
                                !subMaterial
                            ) {

                                return null;

                            }

                            return subMaterial.clone(
                                `${subMaterial.name}_skin`
                            );

                        }
                    );

                mesh.material = clone;

                this.clonedMaterials.add(
                    clone
                );

            }

            return mesh.material;

        }

        /*
         * Already cloned.
         */

        if (
            this.clonedMaterials.has(
                original
            )
        ) {

            return original;

        }

        /*
         * Clone before modifying.
         *
         * This is important because several meshes may
         * share the same GLB material.
         */

        const clone =
            original.clone(
                `${original.name}_skin`
            );

        mesh.material = clone;

        this.clonedMaterials.add(
            clone
        );

        return clone;

    }

    /* ======================================================
     * Apply Color To Material
     * ====================================================== */

    applyColorToMaterial(
        material,
        color
    ) {

        if (!material) {

            return;

        }

        /*
         * Babylon PBR material.
         */

        if (
            "albedoColor"
            in material
        ) {

            material.albedoColor =
                color.clone();

        }

        /*
         * Babylon Standard material.
         */

        if (
            "diffuseColor"
            in material
        ) {

            material.diffuseColor =
                color.clone();

        }

        /*
         * Slightly matte skin appearance.
         */

        if (
            "roughness"
            in material
        ) {

            material.roughness =
                0.72;

        }

        /*
         * Skin should not behave like metal.
         */

        if (
            "metallic"
            in material
        ) {

            material.metallic =
                0.0;

        }

        if (
            "metallicF0"
            in material
        ) {

            material.metallicF0 =
                0.0;

        }

    }

    /* ======================================================
     * Color Normalization
     * ====================================================== */

    normalizeColor(color) {

        /*
         * Babylon Color3
         */

        if (
            color instanceof
            BABYLON.Color3
        ) {

            return color.clone();

        }

        /*
         * HEX string
         */

        if (
            typeof color === "string"
        ) {

            try {

                return BABYLON.Color3.FromHexString(
                    color
                );

            }
            catch {

                return null;

            }

        }

        /*
         * RGB object
         */

        if (
            typeof color === "object" &&
            color !== null &&
            typeof color.r === "number" &&
            typeof color.g === "number" &&
            typeof color.b === "number"
        ) {

            return new BABYLON.Color3(
                color.r,
                color.g,
                color.b
            );

        }

        return null;

    }

    /* ======================================================
     * Bounds
     * ====================================================== */

    getBounds() {

        if (
            !this.meshes.length
        ) {

            return null;

        }

        let min = null;

        let max = null;

        this.meshes.forEach(mesh => {

            if (
                !mesh.getBoundingInfo
            ) {

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

                min =
                    meshMin.clone();

                max =
                    meshMax.clone();

                return;

            }

            min =
                BABYLON.Vector3.Minimize(
                    min,
                    meshMin
                );

            max =
                BABYLON.Vector3.Maximize(
                    max,
                    meshMax
                );

        });

        if (
            !min ||
            !max
        ) {

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

            /*
             * BodyCamera expects dimensions in some
             * versions of the framing implementation.
             */

            dimensions:
                size.clone(),

            radius:
                size.length() / 2

        };

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        this.meshes.forEach(
            mesh =>
                mesh.setEnabled(true)
        );

    }

    hide() {

        this.visible = false;

        this.meshes.forEach(
            mesh =>
                mesh.setEnabled(false)
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

        this.opacity =
            Math.max(
                0,
                Math.min(
                    1,
                    value
                )
            );

        this.meshes.forEach(
            mesh => {

                const material =
                    mesh.material;

                if (!material) {

                    return;

                }

                if (
                    "alpha"
                    in material
                ) {

                    material.alpha =
                        this.opacity;

                }

            }
        );

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
            this.getEntity(
                entityId
            );

        if (!entity) {

            return;

        }

        const names =
            new Set(
                (entity.objects || [])
                    .map(
                        object =>
                            object.object_name
                    )
            );

        this.meshes.forEach(mesh => {

            if (
                names.has(
                    mesh.name
                )
            ) {

                mesh.renderOutline =
                    true;

                mesh.outlineWidth =
                    0.04;

                mesh.outlineColor =
                    BABYLON.Color3.FromHexString(
                        "#00A8FF"
                    );

            }

        });

    }

    clearSelection() {

        this.meshes.forEach(
            mesh => {

                mesh.renderOutline =
                    false;

            }
        );

    }

    /* ======================================================
     * Dispose
     * ====================================================== */

    destroy() {

        this.meshes.forEach(
            mesh => {

                mesh.dispose();

            }
        );

        /*
         * Materials cloned specifically for appearance
         * are disposed separately.
         */

        this.clonedMaterials.forEach(
            material => {

                if (
                    material &&
                    !material.isDisposed()
                ) {

                    material.dispose();

                }

            }
        );

        this.clonedMaterials.clear();

        this.meshes = [];

        this.skinMeshes.clear();

        this.entities.clear();

        this.meshEntities.clear();

        this.root = null;

        this.manifest = null;

        this.material = null;

        this.loaded = false;

    }

}
