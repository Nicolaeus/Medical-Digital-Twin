/**
 * ==========================================================
 * Medical Digital Twin
 * BodyScene.js
 * Babylon Body Twin Scene
 * ==========================================================
 */

import Store from "../../../core/store.js";

import BodyCamera from "./BodyCamera.js";
import BodyLights from "./BodyLights.js";
import BodyModel from "./BodyModel.js";
import BodyAppearance from "./BodyAppearance.js";
import BodySelection from "./BodySelection.js";
import BodyAnimation from "./BodyAnimation.js";

export default class BodyScene {

    constructor(
        engine,
        canvas,
        container = null
    ) {

        this.engine = engine;

        this.canvas = canvas;

        this.container = container;

        /*
         * Babylon
         */

        this.scene = null;

        this.camera = null;

        this.lights = null;

        this.model = null;

        this.appearance = null;

        this.selection = null;

        this.animation = null;


        /*
         * Observers
         */

        this.pointerObserver = null;

        this.cameraObserver = null;


        /*
         * Rendering
         */

        this.renderPipeline = null;


        /*
         * Lifecycle
         */

        this.initialized = false;


        /*
         * Anatomical navigation
         */

        this.anatomicalLevel = "global";

        this.initialCameraRadius = null;

        this.lastCameraRadius = null;


        /*
         * Hover
         */

        this.hoveredMesh = null;

        this.hoveredEntity = null;


        /*
         * Zoom thresholds.
         *
         * Expressed as a ratio of the initial camera radius.
         *
         * > 0.70  = complete body
         * 0.42-0.70 = organs
         * < 0.42 = detailed anatomy
         */

        this.zoomThresholds = {

            organs: 0.70,

            detail: 0.42

        };

    }


    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.scene =
            new BABYLON.Scene(
                this.engine
            );


        /*
         * --------------------------------------------------
         * Transparent background
         * --------------------------------------------------
         */

        this.scene.clearColor =
            new BABYLON.Color4(
                0,
                0,
                0,
                0
            );


        /*
         * --------------------------------------------------
         * Image processing
         * --------------------------------------------------
         */

        this.configureImageProcessing();


        /*
         * --------------------------------------------------
         * Camera
         * --------------------------------------------------
         */

        this.createCamera();


        /*
         * --------------------------------------------------
         * Lighting
         * --------------------------------------------------
         */

        this.createLights();


        /*
         * --------------------------------------------------
         * Rendering pipeline
         * --------------------------------------------------
         */

        this.createRenderPipeline();


        /*
         * --------------------------------------------------
         * Anatomical model
         * --------------------------------------------------
         */

        this.model =
            new BodyModel(
                this.scene
            );

        await this.model.load();


        /*
         * --------------------------------------------------
         * Appearance
         * --------------------------------------------------
         */

        this.appearance =
            new BodyAppearance(
                this.scene,
                this.model
            );

        this.appearance.init({

            mode: "reference",

            skinColor: "#D8B99A"

        });


        /*
         * --------------------------------------------------
         * Camera framing
         * --------------------------------------------------
         */

        this.camera.frameModel(
            this.model
        );


        this.initialCameraRadius =
            this.camera.camera.radius;

        this.lastCameraRadius =
            this.initialCameraRadius;


        /*
         * --------------------------------------------------
         * Initial anatomical level
         * --------------------------------------------------
         */

        this.anatomicalLevel =
            "global";

        this.model.setAnatomicalLevel(
            "global"
        );

        Store.set(
            "body.interaction.level",
            "global"
        );


        /*
         * --------------------------------------------------
         * Selection
         * --------------------------------------------------
         */

        this.selection =
            new BodySelection({

                model:
                    this.model,

                camera:
                    this.camera

            });


        /*
         * --------------------------------------------------
         * Animation
         * --------------------------------------------------
         */

        this.animation =
            new BodyAnimation({

                scene:
                    this.scene,

                model:
                    this.model

            });


        /*
         * --------------------------------------------------
         * Picking / hover
         * --------------------------------------------------
         */

        this.enablePicking();


        /*
         * --------------------------------------------------
         * Camera zoom observer
         * --------------------------------------------------
         */

        this.enableCameraObserver();


        this.initialized = true;

    }


    /* ======================================================
     * Image Processing
     * ====================================================== */

    configureImageProcessing() {

        const configuration =
            this.scene
                .imageProcessingConfiguration;

        configuration.isEnabled = true;

        configuration.toneMappingEnabled =
            true;

        configuration.toneMappingType =
            BABYLON
                .ImageProcessingConfiguration
                .TONEMAPPING_ACES;

        configuration.exposure =
            0.72;

        configuration.contrast =
            1.08;

    }


    /* ======================================================
     * Camera
     * ====================================================== */

    createCamera() {

        this.camera =
            new BodyCamera(
                this.scene,
                this.canvas
            );

        this.camera.init();

    }


    /* ======================================================
     * Lights
     * ====================================================== */

    createLights() {

        this.lights =
            new BodyLights(
                this.scene
            );

        this.lights.init();

    }


    /* ======================================================
     * Rendering Pipeline
     * ====================================================== */

    createRenderPipeline() {

        if (
            !BABYLON.DefaultRenderingPipeline
        ) {

            return;

        }

        this.renderPipeline =
            new BABYLON.DefaultRenderingPipeline(

                "bodyTwinPremiumPipeline",

                true,

                this.scene,

                [
                    this.camera.camera
                ]

            );


        /*
         * Anti-aliasing
         */

        this.renderPipeline.fxaaEnabled =
            true;


        /*
         * Sharpening
         */

        this.renderPipeline.sharpenEnabled =
            true;

        this.renderPipeline.sharpen.edgeAmount =
            0.18;

        this.renderPipeline.sharpen.colorAmount =
            0.85;


        /*
         * Cinematic effects disabled.
         */

        this.renderPipeline.bloomEnabled =
            false;

        this.renderPipeline.motionBlurEnabled =
            false;

        this.renderPipeline.chromaticAberrationEnabled =
            false;

        this.renderPipeline.grainEnabled =
            false;

    }


    /* ======================================================
     * Camera Observer
     * ====================================================== */

    enableCameraObserver() {

        if (
            !this.camera?.camera
        ) {

            return;

        }

        this.cameraObserver =
            this.camera
                .camera
                .onViewMatrixChangedObservable
                .add(
                    () => {

                        this.updateAnatomicalLevel();

                    }
                );

    }


    /* ======================================================
     * Anatomical Zoom
     * ====================================================== */

    updateAnatomicalLevel() {

        if (
            !this.model ||
            !this.camera?.camera ||
            !this.initialCameraRadius
        ) {

            return;

        }

        const radius =
            this.camera.camera.radius;

        if (
            !Number.isFinite(radius)
        ) {

            return;

        }

        this.lastCameraRadius =
            radius;


        const zoomRatio =
            radius /
            this.initialCameraRadius;


        let level =
            "global";


        /*
         * --------------------------------------------------
         * GLOBAL
         * --------------------------------------------------
         */

        if (
            zoomRatio >
            this.zoomThresholds.organs
        ) {

            level =
                "global";

        }


        /*
         * --------------------------------------------------
         * ORGANS
         * --------------------------------------------------
         */

        else if (
            zoomRatio >
            this.zoomThresholds.detail
        ) {

            level =
                "organs";

        }


        /*
         * --------------------------------------------------
         * DETAIL
         * --------------------------------------------------
         */

        else {

            level =
                "detail";

        }


        if (
            level ===
            this.anatomicalLevel
        ) {

            return;

        }


        this.setAnatomicalLevel(
            level
        );

    }


    /* ======================================================
     * Set Anatomical Level
     * ====================================================== */

    setAnatomicalLevel(level) {

        if (
            !this.model
        ) {

            return;

        }


        const allowed = [

            "global",

            "organs",

            "detail"

        ];


        if (
            !allowed.includes(level)
        ) {

            level =
                "global";

        }


        if (
            this.anatomicalLevel ===
            level
        ) {

            return;

        }


        this.anatomicalLevel =
            level;


        /*
         * Model visibility.
         */

        this.model.setAnatomicalLevel(
            level
        );


        /*
         * Store.
         */

        Store.set(
            "body.interaction.level",
            level
        );


        /*
         * Changing anatomical presentation
         * invalidates the previous selection.
         */

        this.selection?.clear();

    }


    /* ======================================================
     * Reset To Global
     * ====================================================== */

    resetToGlobal() {

        if (
            !this.model ||
            !this.camera
        ) {

            return;

        }


        this.model.setAnatomicalLevel(
            "global"
        );


        this.anatomicalLevel =
            "global";


        Store.set(
            "body.interaction.level",
            "global"
        );


        this.selection?.clear();


        this.clearHover();


        this.camera.reset(
            this.model
        );


        this.initialCameraRadius =
            this.camera.camera.radius;

        this.lastCameraRadius =
            this.initialCameraRadius;


        /*
         * --------------------------------------------------
         * Anatomical zoom callback
         * --------------------------------------------------
         */
        
        this.camera.setAnatomicalLevelCallback(
            (level, previous) => {
        
                console.log(
                    "🧬 Anatomical level:",
                    previous,
                    "→",
                    level
                );
        
                this.setAnatomicalLevel(
                    level
                );
        
            }
        );

        this.enableCameraObserver();

        /*
         * Notify the clinical UI.
         *
         * This will later open the patient/global
         * clinical card.
         */

        window.dispatchEvent(

            new CustomEvent(
                "mdt:body:global",
                {

                    detail: {

                        source:
                            "3d",

                        level:
                            "global"

                    }

                }
            )

        );

    }


    /* ======================================================
     * Picking
     * ====================================================== */

    enablePicking() {

        if (!this.scene) {

            return;

        }


        this.pointerObserver =
            this.scene
                .onPointerObservable
                .add(

                    pointerInfo => {

                        /*
                         * --------------------------------------------------
                         * POINTER MOVE
                         * --------------------------------------------------
                         */

                        if (
                            pointerInfo.type ===
                            BABYLON
                                .PointerEventTypes
                                .POINTERMOVE
                        ) {

                            this.handlePointerMove(
                                pointerInfo
                            );

                            return;

                        }


                        /*
                         * --------------------------------------------------
                         * POINTER PICK
                         * --------------------------------------------------
                         */

                        if (
                            pointerInfo.type !==
                            BABYLON
                                .PointerEventTypes
                                .POINTERPICK
                        ) {

                            return;

                        }


                        this.handlePointerPick(
                            pointerInfo
                        );

                    }

                );

    }


    /* ======================================================
     * Pointer Move
     * ====================================================== */

    handlePointerMove(pointerInfo) {

        const pickInfo =
            pointerInfo.pickInfo;


        if (
            !pickInfo?.hit ||
            !pickInfo.pickedMesh
        ) {

            this.clearHover();

            return;

        }


        const mesh =
            pickInfo.pickedMesh;


        const entity =
            this.model
                ?.getEntityForMesh(
                    mesh
                );


        if (!entity) {

            this.clearHover();

            return;

        }


        /*
         * Avoid repeatedly emitting the same
         * hover event every mouse movement.
         */

        if (
            this.hoveredMesh === mesh
        ) {

            return;

        }


        this.hoveredMesh =
            mesh;

        this.hoveredEntity =
            entity;


        Store.set(
            "body.interaction.hoveredEntity",
            entity
        );


        window.dispatchEvent(

            new CustomEvent(
                "mdt:anatomy:hovered",
                {

                    detail: {

                        entityId:
                            entity.id,

                        name:
                            entity.display_name ||
                            entity.canonical_name ||
                            entity.name,

                        category:
                            entity.category,

                        system:
                            entity.system,

                        laterality:
                            entity.laterality,

                        entity,

                        source:
                            "3d"

                    }

                }
            )

        );

    }


    /* ======================================================
     * Clear Hover
     * ====================================================== */

    clearHover() {

        if (
            !this.hoveredMesh &&
            !this.hoveredEntity
        ) {

            return;

        }


        this.hoveredMesh =
            null;

        this.hoveredEntity =
            null;


        Store.set(
            "body.interaction.hoveredEntity",
            null
        );


        window.dispatchEvent(

            new CustomEvent(
                "mdt:anatomy:hovered",
                {

                    detail: {

                        entityId:
                            null,

                        name:
                            null,

                        entity:
                            null,

                        source:
                            "3d"

                    }

                }
            )

        );

    }


    /* ======================================================
     * Pointer Pick
     * ====================================================== */

    handlePointerPick(pointerInfo) {

        const pickInfo =
            pointerInfo.pickInfo;


        /*
         * Nothing picked.
         */

        if (
            !pickInfo?.hit ||
            !pickInfo.pickedMesh
        ) {

            this.selection?.clear();

            return;

        }


        const mesh =
            pickInfo.pickedMesh;


        /*
         * Root.
         */

        const isRoot =
            mesh ===
            this.model?.getRoot();


        /*
         * Anatomical descriptor.
         */

        const descriptor =
            mesh
                ?.metadata
                ?.mdt
                ?.anatomical;


        /*
         * External body surface.
         *
         * We use the anatomical descriptor rather
         * than model.skinMeshes, because BodyModel
         * does not need a dedicated skinMeshes Set.
         */

        const isSkin =
            descriptor?.category ===
            "skin";


        /*
         * Global body/root click.
         */

        if (
            isRoot ||
            isSkin
        ) {

            this.resetToGlobal();

            return;

        }


        /*
         * Anatomical entity.
         */

        const entity =
            this.model
                ?.getEntityForMesh(
                    mesh
                );


        if (!entity) {

            return;

        }


        /*
         * Select.
         */

        this.selection?.selectEntity(
            entity.id
        );

    }


    /* ======================================================
     * Animation
     * ====================================================== */

    startAnimation() {

        /*
         * Animations intentionally disabled
         * for the initial interactive prototype.
         */

    }


    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.camera?.refresh?.();

        this.lights?.refresh?.();

        this.selection?.refresh?.();

        this.engine?.resize();

    }


    /* ======================================================
     * Render
     * ====================================================== */

    render() {

        if (
            !this.scene
        ) {

            return;

        }


        this.animation?.update(

            this.engine.getDeltaTime()

        );


        this.scene.render();

    }


    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        /*
         * Camera observer
         */

        if (
            this.cameraObserver
        ) {

            this.camera
                ?.camera
                ?.onViewMatrixChangedObservable
                ?.remove(
                    this.cameraObserver
                );

            this.cameraObserver =
                null;

        }


        /*
         * Pointer observer
         */

        if (
            this.pointerObserver
        ) {

            this.scene
                ?.onPointerObservable
                ?.remove(
                    this.pointerObserver
                );

            this.pointerObserver =
                null;

        }


        /*
         * Hover state
         */

        this.clearHover();


        /*
         * Selection
         */

        this.selection?.clear();


        /*
         * Animation
         */

        this.animation?.clear();


        /*
         * Model
         */

        this.model?.destroy();


        /*
         * Appearance
         */

        this.appearance?.destroy?.();


        /*
         * Lighting
         */

        this.lights?.destroy();


        /*
         * Rendering pipeline
         */

        this.renderPipeline?.dispose();


        /*
         * Scene
         */

        this.scene?.dispose();


        /*
         * Reset
         */

        this.renderPipeline =
            null;

        this.appearance =
            null;

        this.selection =
            null;

        this.animation =
            null;

        this.model =
            null;

        this.lights =
            null;

        this.camera =
            null;

        this.scene =
            null;

        this.initialCameraRadius =
            null;

        this.lastCameraRadius =
            null;

        this.anatomicalLevel =
            "global";

        this.hoveredMesh =
            null;

        this.hoveredEntity =
            null;

        this.initialized =
            false;

    }


    /* ======================================================
     * Camera Observer
     * ====================================================== */
    
    enableCameraObserver() {
    
        if (
            this.cameraObserver ||
            !this.camera?.camera
        ) {
    
            return;
    
        }
    
        this.cameraObserver =
            this.camera.camera
                .onViewMatrixChangedObservable
                .add(() => {
    
                    this.camera.updateAnatomicalLevel();
    
                });
    
    }
}
