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
 * Anatomical Level
 * ====================================================== */

setAnatomicalLevel(level = "global") {

    const allowed = [
        "global",
        "organs",
        "detail"
    ];

    if (!allowed.includes(level)) {

        level = "global";

    }

    this.anatomicalLevel = level;


    /* ==================================================
     * GLOBAL
     * ==================================================
     *
     * Complete external representation.
     *
     * Everything remains visible.
     */

    if (level === "global") {

        this.meshes.forEach(mesh => {

            mesh.setEnabled(true);

        });

        return;

    }


    /* ==================================================
     * ORGANS
     * ==================================================
     *
     * Hide the external surface and detailed anatomy.
     *
     * Keep:
     *
     * - major organs
     * - brain
     * - eyes
     *
     * This gives us the clinical organ view.
     */

    if (level === "organs") {

        this.meshes.forEach(mesh => {

            const descriptor =
                mesh.metadata
                    ?.mdt
                    ?.anatomical;

            if (!descriptor) {

                mesh.setEnabled(false);

                return;

            }

            const visible =
                descriptor.category === "organs" ||
                descriptor.category === "brain" ||
                descriptor.category === "eyes";

            mesh.setEnabled(
                visible
            );

        });

        return;

    }


    /* ==================================================
     * DETAIL
     * ==================================================
     *
     * Full anatomical representation.
     */

    if (level === "detail") {

        this.meshes.forEach(mesh => {

            mesh.setEnabled(true);

        });

    }

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

}
