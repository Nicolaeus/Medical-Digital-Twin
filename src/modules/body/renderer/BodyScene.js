/**
 * ==========================================================
 * Medical Digital Twin
 * BodyScene.js
 * Babylon Body Twin Scene
 * ==========================================================
 */

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

        this.scene = null;

        this.camera = null;

        this.lights = null;

        this.model = null;

        this.appearance = null;

        this.selection = null;

        this.animation = null;

        this.pointerObserver = null;

        this.cameraObserver = null;

        this.renderPipeline = null;

        this.initialized = false;

        /*
         * --------------------------------------------------
         * Anatomical zoom state
         * --------------------------------------------------
         */

        this.anatomicalLevel = "global";

        this.initialCameraRadius = null;

        this.lastCameraRadius = null;

        /*
         * Prevent unnecessary level changes.
         */

        this.levelTransitionLocked = false;

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
         * Image Processing
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

        /*
         * --------------------------------------------------
         * Store the initial framing radius.
         *
         * This is our reference point for deciding when
         * the user has zoomed sufficiently into the body.
         * --------------------------------------------------
         */

        this.initialCameraRadius =
            this.camera.camera.radius;

        this.lastCameraRadius =
            this.initialCameraRadius;

        /*
         * --------------------------------------------------
         * Start with global body view.
         * --------------------------------------------------
         */

        this.setAnatomicalLevel(
            "global"
        );

        /*
         * --------------------------------------------------
         * Anatomical selection
         * --------------------------------------------------
         */

        this.selection =
            new BodySelection({

                model: this.model,

                camera: this.camera

            });

        /*
         * --------------------------------------------------
         * Animation
         * --------------------------------------------------
         */

        this.animation =
            new BodyAnimation({

                scene: this.scene,

                model: this.model

            });

        /*
         * --------------------------------------------------
         * Picking
         * --------------------------------------------------
         */

        this.enablePicking();

        /*
         * --------------------------------------------------
         * Zoom / anatomical level observer
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
         * Disabled cinematic effects.
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
     * Anatomical Zoom Observer
     * ====================================================== */

    enableCameraObserver() {

        if (
            !this.camera?.camera
        ) {

            return;

        }

        const camera =
            this.camera.camera;

        /*
         * Babylon notifies us whenever the camera view
         * changes: zoom, rotation, target movement, etc.
         */

        this.cameraObserver =
            camera
                .onViewMatrixChangedObservable
                .add(
                    () => {

                        this.updateAnatomicalLevel();

                    }
                );

    }


    /* ======================================================
     * Anatomical Zoom Logic
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

        /*
         * Keep the last value.
         */

        this.lastCameraRadius =
            radius;

        /*
         * --------------------------------------------------
         * Zoom ratio
         *
         * 1.00 = original body framing
         * 0.70 = moderately zoomed
         * 0.40 = strong anatomical zoom
         * --------------------------------------------------
         */

        const zoomRatio =
            radius /
            this.initialCameraRadius;

        let level =
            "global";

        /*
         * --------------------------------------------------
         * GLOBAL
         *
         * Complete patient.
         * --------------------------------------------------
         */

        if (
            zoomRatio > 0.70
        ) {

            level =
                "global";

        }

        /*
         * --------------------------------------------------
         * ORGANS
         *
         * Skin disappears and anatomical structures
         * become available.
         * --------------------------------------------------
         */

        else if (
            zoomRatio > 0.42
        ) {

            level =
                "organs";

        }

        /*
         * --------------------------------------------------
         * DETAIL
         *
         * Deep anatomical navigation.
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

        if (
            this.anatomicalLevel === level
        ) {

            return;

        }

        this.anatomicalLevel =
            level;

        this.model.setAnatomicalLevel(
            level
        );

        /*
         * Clear anatomical selection when changing
         * presentation layers.
         *
         * This prevents a selected hidden mesh from
         * remaining highlighted.
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

        this.setAnatomicalLevel(
            "global"
        );

        this.camera.reset(
            this.model
        );

        this.initialCameraRadius =
            this.camera.camera.radius;

        this.lastCameraRadius =
            this.initialCameraRadius;

    }


    /* ======================================================
     * Picking
     * ====================================================== */

    enablePicking() {

        this.pointerObserver =
            this.scene.onPointerObservable.add(

                pointerInfo => {

                    if (
                        pointerInfo.type !==
                        BABYLON
                            .PointerEventTypes
                            .POINTERPICK
                    ) {

                        return;

                    }

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
                     * --------------------------------------------------
                     * Root / body surface
                     * --------------------------------------------------
                     *
                     * Clicking the global body surface returns
                     * to the complete patient view.
                     * --------------------------------------------------
                     */

                    const isSkin =
                        this.model.skinMeshes
                            ?.has(mesh);

                    const isRoot =
                        mesh ===
                        this.model.getRoot();

                    if (
                        isSkin ||
                        isRoot
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
                            .getEntityForMesh(
                                mesh
                            );

                    /*
                     * Presentation / technical mesh.
                     */

                    if (!entity) {

                        return;

                    }

                    /*
                     * Select anatomical entity.
                     */

                    this.selection.selectEntity(
                        entity.id
                    );

                }

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
         * --------------------------------------------------
         * Camera observer
         * --------------------------------------------------
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
         * --------------------------------------------------
         * Pointer observer
         * --------------------------------------------------
         */

        if (
            this.pointerObserver
        ) {

            this.scene
                ?.onPointerObservable
                .remove(
                    this.pointerObserver
                );

            this.pointerObserver =
                null;

        }

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

        this.renderPipeline = null;

        this.appearance = null;

        this.selection = null;

        this.animation = null;

        this.model = null;

        this.lights = null;

        this.camera = null;

        this.scene = null;

        this.initialCameraRadius =
            null;

        this.lastCameraRadius =
            null;

        this.anatomicalLevel =
            "global";

        this.initialized =
            false;

    }

}
