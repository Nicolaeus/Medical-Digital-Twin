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
         * --------------------------------------------------
         * Babylon
         * --------------------------------------------------
         */

        this.scene = null;

        this.camera = null;

        this.lights = null;

        this.model = null;

        this.appearance = null;

        this.selection = null;

        this.animation = null;


        /*
         * --------------------------------------------------
         * Observers
         * --------------------------------------------------
         */

        this.pointerObserver = null;


        /*
         * IMPORTANT
         *
         * BodyCamera owns the Babylon camera observer.
         *
         * BodyScene only receives the anatomical level
         * callback from BodyCamera.
         * --------------------------------------------------
         */

        this.cameraObserver = null;


        /*
         * --------------------------------------------------
         * Rendering
         * --------------------------------------------------
         */

        this.renderPipeline = null;


        /*
         * --------------------------------------------------
         * Lifecycle
         * --------------------------------------------------
         */

        this.initialized = false;


        /*
         * --------------------------------------------------
         * Anatomical navigation
         * --------------------------------------------------
         */

        this.anatomicalLevel = "global";

        this.initialCameraRadius = null;

        this.lastCameraRadius = null;


        /*
         * --------------------------------------------------
         * Anatomical zoom thresholds
         * --------------------------------------------------
         *
         * These values are relative to the initial body
         * framing radius.
         *
         * > 0.70
         *     GLOBAL
         *
         * 0.42 - 0.70
         *     ORGANS
         *
         * < 0.42
         *     DETAIL
         *
         * The thresholds are currently informational here.
         * BodyCamera performs the actual classification.
         * --------------------------------------------------
         */

        this.zoomThresholds = {

            organs: 0.70,

            detail: 0.42

        };


        /*
         * --------------------------------------------------
         * Hover
         * --------------------------------------------------
         */

        this.hoveredMesh = null;

        this.hoveredEntity = null;

    }


    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        /*
         * --------------------------------------------------
         * Babylon scene
         * --------------------------------------------------
         */

        this.scene =
            new BABYLON.Scene(
                this.engine
            );


        /*
         * --------------------------------------------------
         * Transparent scene background
         * --------------------------------------------------
         *
         * The visible application background is handled
         * outside Babylon.
         *
         * Keeping the Babylon canvas transparent also avoids
         * another independent blue/gray background layer.
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

            mode:
                "reference",

            skinColor:
                "#D8B99A"

        });


        /*
         * --------------------------------------------------
         * Camera framing
         * --------------------------------------------------
         */

        this.camera.frameModel(
            this.model
        );


        /*
         * --------------------------------------------------
         * Initial camera reference
         * --------------------------------------------------
         *
         * This radius represents the complete patient view.
         * BodyCamera also stores its own global radius.
         * --------------------------------------------------
         */

        this.initialCameraRadius =
            this.camera.camera.radius;

        this.lastCameraRadius =
            this.initialCameraRadius;


        /*
         * --------------------------------------------------
         * Anatomical zoom callback
         * --------------------------------------------------
         *
         * BodyCamera is responsible for detecting the
         * anatomical level from the camera radius.
         *
         * BodyScene is responsible for applying that level
         * to the Body Twin.
         *
         * IMPORTANT:
         * This callback is registered ONCE during init().
         *
         * It must NOT be registered from resetToGlobal().
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
         * Anatomical selection
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
         * Ready
         * --------------------------------------------------
         */

        this.initialized =
            true;


        /*
         * --------------------------------------------------
         * Initial diagnostic event
         * --------------------------------------------------
         */

        if (
            typeof window !==
            "undefined"
        ) {

            window.dispatchEvent(

                new CustomEvent(
                    "mdt:body:ready",
                    {

                        detail: {

                            level:
                                "global",

                            radius:
                                this.initialCameraRadius,

                            source:
                                "3d"

                        }

                    }

                )

            );

        }

    }


    /* ======================================================
     * Image Processing
     * ====================================================== */

    configureImageProcessing() {

        const configuration =
            this.scene
                .imageProcessingConfiguration;


        configuration.isEnabled =
            true;


        /*
         * ACES tone mapping.
         */

        configuration.toneMappingEnabled =
            true;


        configuration.toneMappingType =
            BABYLON
                .ImageProcessingConfiguration
                .TONEMAPPING_ACES;


        /*
         * Clinical / soft exposure.
         */

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
         * --------------------------------------------------
         * Anti aliasing
         * --------------------------------------------------
         */

        this.renderPipeline.fxaaEnabled =
            true;


        /*
         * --------------------------------------------------
         * Sharpening
         * --------------------------------------------------
         */

        this.renderPipeline.sharpenEnabled =
            true;


        this.renderPipeline.sharpen.edgeAmount =
            0.18;


        this.renderPipeline.sharpen.colorAmount =
            0.85;


        /*
         * --------------------------------------------------
         * Cinematic effects disabled
         * --------------------------------------------------
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
     * Anatomical Level
     * ====================================================== */

    setAnatomicalLevel(
        level = "global"
    ) {

        const allowedLevels = [

            "global",

            "organs",

            "detail"

        ];


        /*
         * Invalid level.
         */

        if (
            !allowedLevels.includes(
                level
            )
        ) {

            level =
                "global";

        }


        /*
         * Nothing to do.
         */

        if (
            this.anatomicalLevel ===
            level
        ) {

            return;

        }


        const previous =
            this.anatomicalLevel;


        this.anatomicalLevel =
            level;


        /*
         * --------------------------------------------------
         * BodyModel
         * --------------------------------------------------
         *
         * IMPORTANT:
         *
         * BodyModel must not destructively disable the
         * entire anatomical model.
         *
         * The 3211 meshes remain available.
         *
         * BodyAppearance is responsible for presentation.
         * --------------------------------------------------
         */

        this.model?.setAnatomicalLevel(
            level
        );


        /*
         * --------------------------------------------------
         * BodyAppearance
         * --------------------------------------------------
         *
         * Optional for now.
         *
         * When BodyAppearance implements
         * setAnatomicalLevel(), it will control the visual
         * transition:
         *
         * GLOBAL
         *     body surface
         *
         * ORGANS
         *     surface attenuation + organs
         *
         * DETAIL
         *     complete anatomical detail
         * --------------------------------------------------
         */

        if (
            typeof this.appearance
                ?.setAnatomicalLevel ===
            "function"
        ) {

            this.appearance
                .setAnatomicalLevel(
                    level
                );

        }


        /*
         * --------------------------------------------------
         * Store
         * --------------------------------------------------
         */

        Store.set(
            "body.interaction.level",
            level
        );


        /*
         * --------------------------------------------------
         * Selection
         * --------------------------------------------------
         *
         * Changing anatomical presentation invalidates
         * the current anatomical selection.
         * --------------------------------------------------
         */

        this.selection?.clear();


        /*
         * --------------------------------------------------
         * Application event
         * --------------------------------------------------
         */

        if (
            typeof window !==
            "undefined"
        ) {

            window.dispatchEvent(

                new CustomEvent(
                    "mdt:anatomy:levelchanged",
                    {

                        detail: {

                            level:

                                level,

                            previous:

                                previous,

                            source:

                                "body-camera"

                        }

                    }

                )

            );

        }

    }


    /* ======================================================
     * Get Anatomical Level
     * ====================================================== */

    getAnatomicalLevel() {

        return this.anatomicalLevel;

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


        /*
         * --------------------------------------------------
         * Restore model presentation
         * --------------------------------------------------
         */

        this.model.setAnatomicalLevel(
            "global"
        );


        this.anatomicalLevel =
            "global";


        Store.set(
            "body.interaction.level",
            "global"
        );


        /*
         * --------------------------------------------------
         * Clear selection / hover
         * --------------------------------------------------
         */

        this.selection?.clear();

        this.clearHover();


        /*
         * --------------------------------------------------
         * Restore camera
         * --------------------------------------------------
         *
         * BodyCamera.reset() calls frameModel(), which
         * restores the original body framing.
         * --------------------------------------------------
         */

        this.camera.reset(
            this.model
        );


        /*
         * --------------------------------------------------
         * Synchronize reference radius
         * --------------------------------------------------
         */

        this.initialCameraRadius =
            this.camera.camera.radius;


        this.lastCameraRadius =
            this.initialCameraRadius;


        /*
         * --------------------------------------------------
         * IMPORTANT
         *
         * Do NOT install the anatomical callback here.
         *
         * It is already installed once in init().
         * --------------------------------------------------
         */


        /*
         * --------------------------------------------------
         * Notify clinical UI
         * --------------------------------------------------
         */

        if (
            typeof window !==
            "undefined"
        ) {

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

    }


    /* ======================================================
     * Picking
     * ====================================================== */

    enablePicking() {

        if (
            !this.scene ||
            this.pointerObserver
        ) {

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

    handlePointerMove(
        pointerInfo
    ) {

        const pickInfo =
            pointerInfo?.pickInfo;


        /*
         * Nothing under cursor.
         */

        if (
            !pickInfo?.hit ||
            !pickInfo.pickedMesh
        ) {

            this.clearHover();

            return;

        }


        const mesh =
            pickInfo.pickedMesh;


        /*
         * Resolve anatomical entity.
         */

        const entity =
            this.model
                ?.getEntityForMesh(
                    mesh
                );


        /*
         * Technical / unknown mesh.
         */

        if (
            !entity
        ) {

            this.clearHover();

            return;

        }


        /*
         * Avoid emitting identical hover events repeatedly.
         */

        if (
            this.hoveredMesh ===
            mesh
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


        /*
         * UI tooltip event.
         */

        if (
            typeof window !==
            "undefined"
        ) {

            window.dispatchEvent(

                new CustomEvent(
                    "mdt:anatomy:hovered",
                    {

                        detail: {

                            mesh:

                                mesh,

                            entity:

                                entity,

                            name:

                                entity.canonical_name ||
                                entity.display_name ||
                                entity.name ||
                                mesh.name,

                            source:

                                "3d"

                        }

                    }

                )

            );

        }

    }


    /* ======================================================
     * Pointer Pick
     * ====================================================== */

    handlePointerPick(
        pointerInfo
    ) {

        const pickInfo =
            pointerInfo?.pickInfo;


        if (
            !pickInfo?.hit ||
            !pickInfo.pickedMesh
        ) {

            return;

        }


        const mesh =
            pickInfo.pickedMesh;


        /*
         * --------------------------------------------------
         * Root / surface
         * --------------------------------------------------
         *
         * Clicking the body surface while navigating the
         * internal anatomy returns to the global patient
         * representation.
         * --------------------------------------------------
         */

        const descriptor =
            mesh
                ?.metadata
                ?.mdt
                ?.anatomical;


        const isRoot =
            mesh.name ===
            "__root__";


        const isSkin =
            descriptor?.category ===
            "skin";


        /*
         * BodyModel may expose the root directly.
         */

        const modelRoot =
            this.model
                ?.getRoot?.();


        const isModelRoot =
            modelRoot &&
            mesh === modelRoot;


        if (
            isRoot ||
            isSkin ||
            isModelRoot
        ) {

            this.resetToGlobal();

            return;

        }


        /*
         * --------------------------------------------------
         * Anatomical entity
         * --------------------------------------------------
         */

        const entity =
            this.model
                ?.getEntityForMesh(
                    mesh
                );


        /*
         * Unknown / technical mesh.
         */

        if (
            !entity
        ) {

            return;

        }


        /*
         * Select anatomical entity.
         */

        this.selection?.selectEntity(
            entity.id
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


        const previousMesh =
            this.hoveredMesh;


        const previousEntity =
            this.hoveredEntity;


        this.hoveredMesh =
            null;


        this.hoveredEntity =
            null;


        Store.set(
            "body.interaction.hoveredEntity",
            null
        );


        /*
         * Notify tooltip layer.
         */

        if (
            typeof window !==
            "undefined"
        ) {

            window.dispatchEvent(

                new CustomEvent(
                    "mdt:anatomy:hovercleared",
                    {

                        detail: {

                            mesh:

                                previousMesh,

                            entity:

                                previousEntity,

                            source:

                                "3d"

                        }

                    }

                )

            );

        }

    }


    /* ======================================================
     * Start Animation
     * ====================================================== */

    startAnimation() {

        /*
         * Animations intentionally disabled for the initial
         * interactive prototype.
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
         * --------------------------------------------------
         * Pointer observer
         * --------------------------------------------------
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
         * --------------------------------------------------
         * Camera callback
         * --------------------------------------------------
         *
         * BodyCamera owns its own observer.
         * We simply detach our callback.
         * --------------------------------------------------
         */

        this.camera
            ?.setAnatomicalLevelCallback(
                null
            );


        /*
         * --------------------------------------------------
         * Hover
         * --------------------------------------------------
         */

        this.clearHover();


        /*
         * --------------------------------------------------
         * Selection
         * --------------------------------------------------
         */

        this.selection?.clear();


        /*
         * --------------------------------------------------
         * Animation
         * --------------------------------------------------
         */

        this.animation?.clear();


        /*
         * --------------------------------------------------
         * Model
         * --------------------------------------------------
         */

        this.model?.destroy();


        /*
         * --------------------------------------------------
         * Appearance
         * --------------------------------------------------
         */

        this.appearance?.destroy?.();


        /*
         * --------------------------------------------------
         * Lighting
         * --------------------------------------------------
         */

        this.lights?.destroy();


        /*
         * --------------------------------------------------
         * Rendering pipeline
         * --------------------------------------------------
         */

        this.renderPipeline?.dispose();


        /*
         * --------------------------------------------------
         * Scene
         * --------------------------------------------------
         */

        this.scene?.dispose();


        /*
         * --------------------------------------------------
         * Reset
         * --------------------------------------------------
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

        this.pointerObserver =
            null;

        this.cameraObserver =
            null;

        this.initialized =
            false;

    }

}
