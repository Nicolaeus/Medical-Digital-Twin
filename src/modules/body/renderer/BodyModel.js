/**
 * ==========================================================
 * Medical Digital Twin
 * BodyModel.js
 * Anatomical 3D Model Manager
 * ==========================================================
 *
 * Responsibilities:
 *
 * - Load the GLB
 * - Load the anatomical manifest when available
 * - Index every mesh
 * - Detect anatomical names
 * - Detect laterality
 * - Group primitive meshes
 * - Classify anatomical structures
 * - Build anatomical entities
 * - Support global / organs / detail levels
 * - Provide mesh -> entity resolution
 * - Manage visibility
 * - Manage selection highlighting
 *
 * The GLB remains the visual/anatomical source.
 * Clinical data must remain outside the GLB.
 *
 * ==========================================================
 */

export default class BodyModel {

    constructor(scene) {

        this.scene = scene;

        /*
         * Babylon objects
         */

        this.root = null;

        this.meshes = [];

        /*
         * Anatomical entities
         *
         * entityId -> entity
         */

        this.entities = new Map();

        /*
         * Exact mesh lookup
         *
         * mesh.name -> entity
         */

        this.meshEntities = new Map();

        /*
         * Normalized anatomical lookup
         */

        this.anatomyIndex = new Map();

        /*
         * Category index
         *
         * category -> entities[]
         */

        this.categoryIndex = new Map();

        /*
         * Current presentation level
         */

        this.anatomicalLevel = "global";

        /*
         * Visibility
         */

        this.visible = true;

        /*
         * Model state
         */

        this.loaded = false;

        /*
         * Optional manifest
         */

        this.manifest = null;

        /*
         * Material cache
         */

        this.materials = new Map();

        /*
         * Current selection
         */

        this.selectedEntity = null;

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

        /*
         * Manifest is optional.
         *
         * The GLB itself contains enough anatomical
         * information to build the basic entity index.
         */

        try {

            await this.loadManifest(
                manifestPath
            );

        }

        catch (error) {

            console.warn(
                "Body Twin manifest unavailable. " +
                "Building anatomy directly from GLB.",
                error
            );

            this.manifest = null;

        }


        /*
         * Import GLB.
         */

        const result =
            await BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "",
                modelPath,
                this.scene
            );


        /*
         * Keep actual meshes only.
         */

        this.meshes =
            result.meshes.filter(
                mesh =>
                    mesh instanceof BABYLON.Mesh
            );


        /*
         * Root
         */

        this.root =
            result.meshes.find(
                mesh =>
                    mesh.name === "__root__"
            )
            || result.meshes[0]
            || null;


        /*
         * Cache materials.
         */

        this.indexMaterials();


        /*
         * Build anatomical representation.
         */

        this.buildAnatomicalIndex();


        /*
         * Build manifest mappings when available.
         */

        this.mergeManifestEntities();


        /*
         * Initial presentation.
         */

        this.setAnatomicalLevel(
            "global"
        );


        this.loaded = true;

        return this;

    }


    /* ======================================================
     * Manifest
     * ====================================================== */

    async loadManifest(path) {

        if (!path) {

            return;

        }

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                `Unable to load Body Twin manifest: ${path}`
            );

        }


        this.manifest =
            await response.json();

    }


    /* ======================================================
     * Materials
     * ====================================================== */

    indexMaterials() {

        this.materials.clear();

        this.meshes.forEach(
            mesh => {

                const material =
                    mesh.material;

                if (!material) {

                    return;

                }

                const name =
                    material.name ||
                    "UnnamedMaterial";

                if (
                    !this.materials.has(name)
                ) {

                    this.materials.set(
                        name,
                        material
                    );

                }

            }
        );

    }


    /* ======================================================
     * Anatomy Index
     * ====================================================== */

    buildAnatomicalIndex() {

        this.entities.clear();

        this.meshEntities.clear();

        this.anatomyIndex.clear();

        this.categoryIndex.clear();


        this.meshes.forEach(
            mesh => {

                const descriptor =
                    this.describeMesh(
                        mesh
                    );

                /*
                 * Save metadata on the mesh.
                 *
                 * Existing metadata is preserved.
                 */

                mesh.metadata = {

                    ...(mesh.metadata || {}),

                    mdt: {

                        ...(mesh.metadata?.mdt || {}),

                        anatomical:
                            descriptor

                    }

                };


                /*
                 * Group key.
                 */

                const key =
                    this.createAnatomyKey(
                        descriptor
                    );


                let entity =
                    this.anatomyIndex.get(
                        key
                    );


                /*
                 * Create entity.
                 */

                if (!entity) {

                    entity =
                        this.createEntity(
                            descriptor
                        );

                    this.anatomyIndex.set(
                        key,
                        entity
                    );

                    this.entities.set(
                        entity.id,
                        entity
                    );

                    this.addCategoryEntity(
                        entity
                    );

                }


                /*
                 * Add mesh to entity.
                 */

                entity.objects.push({

                    object_name:
                        mesh.name,

                    mesh_name:
                        mesh.name,

                    material:
                        descriptor.material,

                    primitive:
                        descriptor.primitive,

                    laterality:
                        descriptor.laterality

                });


                /*
                 * Exact mesh lookup.
                 */

                this.meshEntities.set(
                    mesh.name,
                    entity
                );

            }
        );

    }


    /* ======================================================
     * Mesh Description
     * ====================================================== */

    describeMesh(mesh) {

        const rawName =
            mesh?.name || "";


        const material =
            mesh?.material?.name ||
            "";


        const anatomicalName =
            this.extractAnatomicalName(
                rawName
            );


        const laterality =
            this.extractLaterality(
                rawName
            );


        const primitive =
            this.extractPrimitive(
                rawName
            );


        const category =
            this.classifyAnatomy(
                anatomicalName,
                material,
                rawName
            );


        const system =
            this.detectSystem(
                anatomicalName,
                category
            );


        const level =
            this.detectAnatomicalLevel(
                anatomicalName,
                category,
                material
            );


        return {

            meshName:
                rawName,

            anatomicalName,

            displayName:
                this.formatDisplayName(
                    anatomicalName
                ),

            laterality,

            primitive,

            material,

            category,

            system,

            level

        };

    }


    /* ======================================================
     * Anatomical Name
     * ====================================================== */

    extractAnatomicalName(name) {

        let value =
            String(name || "");


        /*
         * Remove common GLB prefixes.
         */

        value =
            value.replace(
                /^MDT_Surface__/,
                ""
            );


        value =
            value.replace(
                /^MDT_liver__/,
                ""
            );


        /*
         * Remove primitive suffix.
         *
         * Examples:
         *
         * xxx_primitive0
         * xxx_primitive1
         */

        value =
            value.replace(
                /_primitive\d+$/i,
                ""
            );


        /*
         * Remove skin material suffixes
         * only when they are explicit suffixes.
         */

        value =
            value.replace(
                /_skin$/i,
                ""
            );


        return value.trim();

    }


    /* ======================================================
     * Laterality
     * ====================================================== */

    extractLaterality(name) {

        const value =
            String(name || "");


        /*
         * .l / .r
         */

        if (
            /\.l(?:_primitive\d+)?$/i.test(
                value
            )
        ) {

            return "left";

        }


        if (
            /\.r(?:_primitive\d+)?$/i.test(
                value
            )
        ) {

            return "right";

        }


        /*
         * Some anatomical structures don't
         * encode laterality.
         */

        return "none";

    }


    /* ======================================================
     * Primitive
     * ====================================================== */

    extractPrimitive(name) {

        const match =
            String(name || "")
                .match(
                    /_primitive(\d+)$/i
                );


        if (!match) {

            return 0;

        }


        return Number(
            match[1]
        );

    }


    /* ======================================================
     * Anatomy Key
     * ====================================================== */

    createAnatomyKey(descriptor) {

        return [

            descriptor.category,

            descriptor.anatomicalName
                .toLowerCase(),

            descriptor.laterality

        ].join(
            "::"
        );

    }


    /* ======================================================
     * Entity Creation
     * ====================================================== */

    createEntity(descriptor) {

        const id =
            this.createEntityId(
                descriptor
            );


        return {

            id,

            canonical_name:
                descriptor.anatomicalName,

            display_name:
                descriptor.displayName,

            name:
                descriptor.displayName,

            category:
                descriptor.category,

            system:
                descriptor.system,

            laterality:
                descriptor.laterality,

            level:
                descriptor.level,

            objects: [],

            clinical: null,

            source:
                "glb"

        };

    }


    /* ======================================================
     * Entity ID
     * ====================================================== */

    createEntityId(descriptor) {

        let value =
            descriptor.anatomicalName
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "_"
                )
                .replace(
                    /^_+|_+$/g,
                    ""
                );


        if (!value) {

            value = "structure";

        }


        if (
            descriptor.laterality !==
            "none"
        ) {

            value +=
                "_" +
                descriptor.laterality;

        }


        return (

            descriptor.category +
            "_" +
            value

        );

    }


    /* ======================================================
     * Category
     * ====================================================== */

    classifyAnatomy(
        anatomicalName,
        material,
        rawName
    ) {

        const name =
            String(
                anatomicalName ||
                ""
            ).toLowerCase();


        const mat =
            String(
                material ||
                ""
            ).toLowerCase();


        /*
         * Skin / surface
         */

        if (
            name.includes("skin") ||
            name.includes("region") ||
            mat.includes("skin")
        ) {

            return "skin";

        }


        /*
         * Brain
         */

        if (
            name.includes("brain") ||
            name.includes("cerebell") ||
            name.includes("lobe") ||
            name.includes("sulcus") ||
            name.includes("gyrus") ||
            name.includes("nucleus") ||
            name.includes("white matter") ||
            name.includes("ventricle") ||
            name.includes("pons") ||
            name.includes("medulla")
        ) {

            return "brain";

        }


        /*
         * Bones
         */

        if (
            mat.startsWith("bone") ||
            name.includes("bone") ||
            name.includes("phalanx") ||
            name.includes("metatarsal") ||
            name.includes("carpal") ||
            name.includes("tarsal")
        ) {

            return "bones";

        }


        /*
         * Cartilage
         */

        if (
            mat.includes("cartilage") ||
            name.includes("cartilage")
        ) {

            return "cartilage";

        }


        /*
         * Muscles
         */

        if (
            mat.includes("abductor") ||
            mat.includes("adductor") ||
            mat.includes("flexion") ||
            mat.includes("extension") ||
            mat.includes("rotator") ||
            mat.includes("depressor") ||
            mat.includes("levator") ||
            mat.includes("superficial") ||
            mat.includes("trapezius") ||
            mat.includes("masticator") ||
            name.includes("muscle")
        ) {

            return "muscles";

        }


        /*
         * Tendons
         */

        if (
            mat.includes("tendon") ||
            name.includes("tendon")
        ) {

            return "tendons";

        }


        /*
         * Ligaments / capsules
         */

        if (
            mat.includes("ligament") ||
            mat.includes("articular capsule") ||
            name.includes("ligament") ||
            name.includes("articular capsule")
        ) {

            return "ligaments";

        }


        /*
         * Vessels
         */

        if (
            mat.includes("artery") ||
            mat.includes("pulmonary artery") ||
            mat.includes("vein") ||
            mat.includes("vessel") ||
            name.includes("artery") ||
            name.includes("vein") ||
            name.includes("vascular")
        ) {

            return "vessels";

        }


        /*
         * Nerves
         */

        if (
            mat.includes("nerve") ||
            name.includes("nerve") ||
            name.includes("ganglia")
        ) {

            return "nerves";

        }


        /*
         * Lymphatic
         */

        if (
            name.includes("lymph") ||
            mat.includes("lymph")
        ) {

            return "lymphatic";

        }


        /*
         * Eyes
         */

        if (
            mat.includes("cornea") ||
            mat.includes("eye") ||
            name.includes("eye") ||
            name.includes("iris") ||
            name.includes("retina")
        ) {

            return "eyes";

        }


        /*
         * Teeth
         */

        if (
            mat.includes("teeth") ||
            mat.includes("dentine") ||
            name.includes("tooth") ||
            name.includes("teeth")
        ) {

            return "teeth";

        }


        /*
         * Diaphragm
         */

        if (
            mat.includes("diaphragm") ||
            name.includes("diaphragm")
        ) {

            return "muscles";

        }


        /*
         * Organs
         */

        if (
            mat === "organ" ||
            mat.startsWith("organ-") ||
            this.isMajorOrgan(name)
        ) {

            return "organs";

        }


        /*
         * Default
         */

        return "other";

    }


    /* ======================================================
     * Major Organ Detection
     * ====================================================== */

    isMajorOrgan(name) {

        const organs = [

            "heart",

            "lung",

            "liver",

            "stomach",

            "pancreas",

            "spleen",

            "kidney",

            "bladder",

            "intestine",

            "gallbladder",

            "thyroid",

            "thymus",

            "esophagus",

            "trachea",

            "bronch",

            "prostate",

            "uterus",

            "ovary",

            "testis",

            "adrenal",

            "appendix"

        ];


        return organs.some(
            organ =>
                name.includes(
                    organ
                )
        );

    }


    /* ======================================================
     * Anatomical System
     * ====================================================== */

    detectSystem(
        anatomicalName,
        category
    ) {

        const name =
            String(
                anatomicalName ||
                ""
            ).toLowerCase();


        if (
            category === "brain" ||
            category === "nerves"
        ) {

            return "nervous";

        }


        if (
            category === "vessels"
        ) {

            return "cardiovascular";

        }


        if (
            category === "lymphatic"
        ) {

            return "lymphatic";

        }


        if (
            category === "bones" ||
            category === "muscles" ||
            category === "cartilage" ||
            category === "tendons" ||
            category === "ligaments"
        ) {

            return "musculoskeletal";

        }


        if (
            name.includes("lung") ||
            name.includes("bronch") ||
            name.includes("trachea") ||
            name.includes("diaphragm")
        ) {

            return "respiratory";

        }


        if (
            name.includes("liver") ||
            name.includes("stomach") ||
            name.includes("intestin") ||
            name.includes("pancreas") ||
            name.includes("spleen") ||
            name.includes("gallbladder")
        ) {

            return "digestive";

        }


        if (
            name.includes("kidney") ||
            name.includes("bladder") ||
            name.includes("renal") ||
            name.includes("ureter")
        ) {

            return "urinary";

        }


        if (
            name.includes("thyroid") ||
            name.includes("adrenal") ||
            name.includes("pituitary") ||
            name.includes("thymus")
        ) {

            return "endocrine";

        }


        if (
            name.includes("ovary") ||
            name.includes("uterus") ||
            name.includes("testis") ||
            name.includes("prostate") ||
            name.includes("reproductive")
        ) {

            return "reproductive";

        }


        if (
            category === "skin"
        ) {

            return "integumentary";

        }


        return null;

    }


    /* ======================================================
     * Anatomical Level
     * ====================================================== */

    detectAnatomicalLevel(
        anatomicalName,
        category,
        material
    ) {

        /*
         * Global surface.
         */

        if (
            category === "skin"
        ) {

            return "global";

        }


        /*
         * Major organs and systems.
         */

        if (
            category === "organs" ||
            category === "brain"
        ) {

            return "organs";

        }


        /*
         * Everything else is detailed anatomy.
         */

        return "detail";

    }


    /* ======================================================
     * Display Name
     * ====================================================== */

    formatDisplayName(name) {

        let value =
            String(name || "");


        value =
            value.replace(
                /\s+/g,
                " "
            );


        return value
            .trim();

    }


    /* ======================================================
     * Category Index
     * ====================================================== */

    addCategoryEntity(entity) {

        const category =
            entity.category;


        if (
            !this.categoryIndex.has(
                category
            )
        ) {

            this.categoryIndex.set(
                category,
                []
            );

        }


        this.categoryIndex
            .get(category)
            .push(entity);

    }


    /* ======================================================
     * Manifest Merge
     * ====================================================== */

    mergeManifestEntities() {

        const manifestEntities =
            this.manifest?.entities;


        if (
            !manifestEntities ||
            typeof manifestEntities !==
            "object"
        ) {

            return;

        }


        Object.entries(
            manifestEntities
        ).forEach(
            ([id, manifestEntity]) => {

                /*
                 * Existing generated entity.
                 */

                const existing =
                    this.entities.get(
                        id
                    );


                if (existing) {

                    Object.assign(
                        existing,
                        manifestEntity
                    );

                    return;

                }


                /*
                 * Manifest-only entity.
                 *
                 * Keep it available even if no
                 * corresponding mesh was found.
                 */

                this.entities.set(
                    id,
                    {

                        id,

                        ...manifestEntity,

                        objects:
                            manifestEntity.objects ||
                            [],

                        source:
                            "manifest"

                    }
                );

            }
        );


        /*
         * Rebuild exact mesh mapping after
         * manifest enrichment.
         */

        this.entities.forEach(
            entity => {

                (
                    entity.objects ||
                    []
                ).forEach(
                    object => {

                        if (
                            object.object_name
                        ) {

                            this.meshEntities.set(
                                object.object_name,
                                entity
                            );

                        }

                    }
                );

            }
        );

    }


    /* ======================================================
     * Entity Access
     * ====================================================== */

    getEntity(id) {

        return (
            this.entities.get(id) ||
            null
        );

    }


    getEntities() {

        return Array.from(
            this.entities.values()
        );

    }


    getEntitiesByCategory(
        category
    ) {

        return [
            ...(
                this.categoryIndex.get(
                    category
                ) || []
            )
        ];

    }


    getEntitiesBySystem(
        system
    ) {

        return this.getEntities()
            .filter(
                entity =>
                    entity.system ===
                    system
            );

    }


    /* ======================================================
     * Mesh -> Entity
     * ====================================================== */

    getEntityForMesh(
        meshOrName
    ) {

        const name =
            typeof meshOrName ===
            "string"

                ? meshOrName

                : meshOrName?.name;


        if (!name) {

            return null;

        }


        return (
            this.meshEntities.get(
                name
            ) ||

            this.findEntityForMesh(
                name
            )

        );

    }


    findEntityForMesh(
        meshName
    ) {

        /*
         * Manifest fallback.
         */

        for (
            const entity
            of this.entities.values()
        ) {

            const objects =
                entity.objects ||
                [];


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
     * Mesh Access
     * ====================================================== */

    getOrgan(name) {

        if (!name) {

            return null;

        }


        const target =
            String(name)
                .toLowerCase();


        return (
            this.meshes.find(
                mesh =>
                    mesh.name
                        .toLowerCase() ===
                    target
            ) ||
            null
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

        if (
            !this.meshes.length
        ) {

            return null;

        }


        let min = null;

        let max = null;


        this.meshes.forEach(
            mesh => {

                if (
                    !mesh.getBoundingInfo
                ) {

                    return;

                }


                const bounding =
                    mesh
                        .getBoundingInfo()
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

            }
        );


        if (
            !min ||
            !max
        ) {

            return null;

        }


        const center =
            min
                .add(max)
                .scale(0.5);


        const size =
            max.subtract(min);


        return {

            min,

            max,

            center,

            size,

            /*
             * Compatibility with existing
             * BodyCamera code.
             */

            dimensions:
                size.clone(),

            radius:
                size.length() / 2

        };

    }


    /* ======================================================
     * Presentation Level
     * ====================================================== */

    setAnatomicalLevel(
        level = "global"
    ) {

        const allowed = [

            "global",

            "organs",

            "detail"

        ];


        if (
            !allowed.includes(
                level
            )
        ) {

            level = "global";

        }


        this.anatomicalLevel =
            level;


        /*
         * Important:
         *
         * We do NOT hide the model aggressively.
         * The first implementation should preserve
         * the visual integrity of the GLB.
         *
         * We only progressively reveal detailed
         * anatomical structures.
         */

        this.meshes.forEach(
            mesh => {

                const descriptor =
                    mesh.metadata
                        ?.mdt
                        ?.anatomical;


                if (!descriptor) {

                    return;

                }


                let enabled = true;


                if (
                    level === "global"
                ) {

                    enabled =
                        descriptor.level ===
                        "global";

                }


                else if (
                    level === "organs"
                ) {

                    enabled =
                        descriptor.level ===
                            "global" ||
                        descriptor.level ===
                            "organs";

                }


                else if (
                    level === "detail"
                ) {

                    enabled = true;

                }


                mesh.setEnabled(
                    enabled
                );

            }
        );

    }


    getAnatomicalLevel() {

        return this.anatomicalLevel;

    }


    /* ======================================================
     * Progressive Zoom Support
     * ====================================================== */

updateAnatomicalLevel(
        radius,
        thresholds = {}
    ) {

        const organs =
            thresholds.organs ??
            1.8;


        const detail =
            thresholds.detail ??
            0.9;


        let level =
            "global";


        if (
            radius <= detail
        ) {

            level =
                "detail";

        }

        else if (
            radius <= organs
        ) {

            level =
                "organs";

        }


        if (
            level !==
            this.anatomicalLevel
        ) {

            this.setAnatomicalLevel(
                level
            );

        }


        return level;

    }


    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.visible = true;

        this.meshes.forEach(
            mesh =>
                mesh.setEnabled(
                    true
                )
        );

    }


    hide() {

        this.visible = false;

        this.meshes.forEach(
            mesh =>
                mesh.setEnabled(
                    false
                )
        );

    }


    toggle() {

        this.visible
            ? this.hide()
            : this.show();

    }


    /* ======================================================
     * Selection
     * ====================================================== */

    highlight(name) {

        this.clearSelection();


        const mesh =
            this.getOrgan(
                name
            );


        if (!mesh) {

            return;

        }


        mesh.renderOutline =
            true;


        mesh.outlineWidth =
            0.04;


        mesh.outlineColor =
            BABYLON.Color3
                .FromHexString(
                    "#00A8FF"
                );


        this.selectedEntity =
            this.getEntityForMesh(
                mesh
            );

    }


    highlightEntity(
        entityId
    ) {

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


        this.meshes.forEach(
            mesh => {

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
                        BABYLON.Color3
                            .FromHexString(
                                "#00A8FF"
                            );

                }

            }
        );


        this.selectedEntity =
            entity;

    }


    clearSelection() {

        this.meshes.forEach(
            mesh => {

                mesh.renderOutline =
                    false;

            }
        );


        this.selectedEntity =
            null;

    }


    /* ======================================================
     * Selection State
     * ====================================================== */

    getSelectedEntity() {

        return this.selectedEntity;

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


        this.meshes = [];


        this.entities.clear();

        this.meshEntities.clear();

        this.anatomyIndex.clear();

        this.categoryIndex.clear();

        this.materials.clear();


        this.root = null;

        this.manifest = null;

        this.selectedEntity = null;

        this.loaded = false;

    }

}/**
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

        /*
         * --------------------------------------------------
         * Anatomical layers
         * --------------------------------------------------
         */

        this.skinMeshes = new Set();

        this.organMeshes = new Set();

        this.detailMeshes = new Set();

        this.clonedMaterials = new Set();

        /*
         * Current anatomical display level.
         */

        this.anatomicalLevel = "global";

        /*
         * --------------------------------------------------
         * State
         * --------------------------------------------------
         */

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

        /*
         * Build anatomical indexes.
         */

        this.buildEntityIndex();

        this.buildAnatomicalIndex();

        this.buildSkinIndex();

        /*
         * Start with the complete patient surface.
         */

        this.setAnatomicalLevel(
            "global"
        );

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
     * Anatomical Index
     * ====================================================== */

    buildAnatomicalIndex() {

        this.organMeshes.clear();

        this.detailMeshes.clear();

        this.meshes.forEach(mesh => {

            /*
             * Root / technical meshes are not anatomical.
             */

            if (
                !this.isRenderableMesh(mesh)
            ) {

                return;

            }

            if (
                mesh === this.root
            ) {

                return;

            }

            /*
             * Skin is handled separately.
             */

            if (
                this.isLikelySkinMesh(mesh)
            ) {

                return;

            }

            /*
             * If the mesh belongs to an entity,
             * it is considered anatomical.
             */

            const entity =
                this.getEntityForMesh(
                    mesh
                );

            if (entity) {

                this.organMeshes.add(
                    mesh
                );

                this.detailMeshes.add(
                    mesh
                );

                return;

            }

            /*
             * Otherwise use anatomical naming
             * heuristics.
             */

            if (
                this.isLikelyAnatomicalMesh(
                    mesh
                )
            ) {

                this.organMeshes.add(
                    mesh
                );

                this.detailMeshes.add(
                    mesh
                );

            }

        });

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

                this.skinMeshes.add(
                    mesh
                );

            }

        });

        /*
         * Current Body Twin surface export is primarily
         * a skin/body surface.
         *
         * If no explicit skin meshes can be identified,
         * use meshes which do not belong to an anatomical
         * entity as the surface fallback.
         */

        if (
            this.skinMeshes.size === 0
        ) {

            this.meshes.forEach(mesh => {

                if (
                    this.isRenderableMesh(mesh) &&
                    !this.organMeshes.has(mesh)
                ) {

                    this.skinMeshes.add(
                        mesh
                    );

                }

            });

        }

    }


    /* ======================================================
     * Renderable Mesh
     * ====================================================== */

    isRenderableMesh(mesh) {

        return (
            mesh instanceof BABYLON.Mesh &&
            mesh.geometry !== null
        );

    }


    /* ======================================================
     * Skin Detection
     * ====================================================== */

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

        const skinTerms = [

            "skin",
            "epiderm",
            "dermis",
            "cutaneous",
            "integument",
            "body_surface",
            "body surface",
            "surface_body",
            "external",
            "outer",
            "body"

        ];

        const internalTerms = [

            "brain",
            "heart",
            "lung",
            "liver",
            "kidney",
            "spleen",
            "stomach",
            "intestine",
            "colon",
            "bone",
            "skull",
            "vertebra",
            "arter",
            "vein",
            "nerve",
            "muscle",
            "organ"

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

        return (
            hasSkinTerm &&
            !hasInternalTerm
        );

    }


    /* ======================================================
     * Anatomical Detection
     * ====================================================== */

    isLikelyAnatomicalMesh(mesh) {

        if (!mesh) {

            return false;

        }

        const name =
            String(
                mesh.name || ""
            ).toLowerCase();

        const material =
            String(
                mesh.material?.name || ""
            ).toLowerCase();

        const combined =
            `${name} ${material}`;

        const anatomicalTerms = [

            "brain",
            "heart",
            "lung",
            "liver",
            "kidney",
            "spleen",
            "stomach",
            "intestin",
            "colon",
            "pancre",
            "thyroid",
            "bladder",
            "prostate",
            "uter",
            "ovary",
            "test",
            "bone",
            "skull",
            "mandible",
            "vertebr",
            "pelvis",
            "femur",
            "tibia",
            "fibula",
            "humer",
            "radius",
            "ulna",
            "rib",
            "stern",
            "muscle",
            "arter",
            "vein",
            "vessel",
            "nerve",
            "cartilage",
            "tendon",
            "organ"

        ];

        return anatomicalTerms.some(
            term =>
                combined.includes(term)
        );

    }


    /* ======================================================
     * Anatomical Level
     * ====================================================== */

    setAnatomicalLevel(level) {

        const allowedLevels = [

            "global",
            "organs",
            "detail"

        ];

        if (
            !allowedLevels.includes(
                level
            )
        ) {

            return;

        }

        this.anatomicalLevel =
            level;

        /*
         * Do not do anything before the
         * model is actually loaded.
         */

        if (!this.loaded && !this.meshes.length) {

            return;

        }

        /*
         * --------------------------------------------------
         * GLOBAL
         * --------------------------------------------------
         *
         * Patient surface only.
         */

        if (
            level === "global"
        ) {

            this.applyGlobalView();

            return;

        }

        /*
         * --------------------------------------------------
         * ORGANS
         * --------------------------------------------------
         *
         * Hide external body surface and expose
         * anatomical structures.
         */

        if (
            level === "organs"
        ) {

            this.applyOrganView();

            return;

        }

        /*
         * --------------------------------------------------
         * DETAIL
         * --------------------------------------------------
         *
         * Expose all anatomical meshes available
         * in the GLB.
         */

        if (
            level === "detail"
        ) {

            this.applyDetailView();

        }

    }


    /* ======================================================
     * Global View
     * ====================================================== */

    applyGlobalView() {

        /*
         * Skin ON.
         */

        this.skinMeshes.forEach(
            mesh =>
                mesh.setEnabled(true)
        );

        /*
         * Internal anatomy OFF.
         */

        this.organMeshes.forEach(
            mesh =>
                mesh.setEnabled(false)
        );

        /*
         * Detail meshes OFF.
         */

        this.detailMeshes.forEach(
            mesh =>
                mesh.setEnabled(false)
        );

    }


    /* ======================================================
     * Organ View
     * ====================================================== */

    applyOrganView() {

        /*
         * Skin OFF.
         */

        this.skinMeshes.forEach(
            mesh =>
                mesh.setEnabled(false)
        );

        /*
         * Main anatomical structures ON.
         */

        this.organMeshes.forEach(
            mesh =>
                mesh.setEnabled(true)
        );

        /*
         * Detail structures stay hidden.
         *
         * At the moment organMeshes and detailMeshes
         * may overlap because the current GLB does not
         * necessarily declare explicit detail layers.
         *
         * We therefore keep the entity meshes visible.
         */

    }


    /* ======================================================
     * Detail View
     * ====================================================== */

    applyDetailView() {

        /*
         * Skin OFF.
         */

        this.skinMeshes.forEach(
            mesh =>
                mesh.setEnabled(false)
        );

        /*
         * Everything anatomical ON.
         */

        this.detailMeshes.forEach(
            mesh =>
                mesh.setEnabled(true)
        );

    }


    /* ======================================================
     * Current Anatomical Level
     * ====================================================== */

    getAnatomicalLevel() {

        return this.anatomicalLevel;

    }


    /* ======================================================
     * Skin Appearance
     * ====================================================== */

    applySkinAppearance(color) {

        if (!color) {

            return;

        }

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

                mesh.material =
                    clone;

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
         */

        const clone =
            original.clone(
                `${original.name}_skin`
            );

        mesh.material =
            clone;

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

        if (
            "albedoColor"
            in material
        ) {

            material.albedoColor =
                color.clone();

        }

        if (
            "diffuseColor"
            in material
        ) {

            material.diffuseColor =
                color.clone();

        }

        /*
         * Matte clinical skin.
         */

        if (
            "roughness"
            in material
        ) {

            material.roughness =
                0.72;

        }

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

        if (
            color instanceof
            BABYLON.Color3
        ) {

            return color.clone();

        }

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

        /*
         * Restore current anatomical state.
         */

        this.setAnatomicalLevel(
            this.anatomicalLevel
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

        mesh.renderOutline =
            true;

        mesh.outlineWidth =
            0.04;

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

        this.organMeshes.clear();

        this.detailMeshes.clear();

        this.entities.clear();

        this.meshEntities.clear();

        this.root = null;

        this.manifest = null;

        this.material = null;

        this.anatomicalLevel =
            "global";

        this.loaded = false;

    }

}
