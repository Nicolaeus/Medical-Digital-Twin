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

    constructor(engine, canvas, container = null) {

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

        this.renderPipeline = null;

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.scene = new BABYLON.Scene(
            this.engine
        );

        /*
         * --------------------------------------------------
         * Transparent background
         * --------------------------------------------------
         *
         * Babylon renders only the anatomical model.
         *
         * The visual background is handled by CSS.
         *
         * This prevents ACES / exposure / post-processing
         * from altering the application background color.
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
         *
         * Applies to the 3D model.
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

        this.model = new BodyModel(
            this.scene
        );

        await this.model.load();

        /*
         * --------------------------------------------------
         * Appearance
         * --------------------------------------------------
         *
         * Appearance controls the anatomical model only.
         *
         * The background is deliberately NOT controlled here.
         */

        this.appearance = new BodyAppearance(
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
         * Anatomical selection
         * --------------------------------------------------
         */

        this.selection = new BodySelection({

            model: this.model,

            camera: this.camera

        });

        /*
         * --------------------------------------------------
         * Animation
         * --------------------------------------------------
         */

        this.animation = new BodyAnimation({

            scene: this.scene,

            model: this.model

        });

        /*
         * --------------------------------------------------
         * Picking
         * --------------------------------------------------
         */

        this.enablePicking();

        this.initialized = true;

    }

    /* ======================================================
     * Image Processing
     * ====================================================== */

    configureImageProcessing() {

        const configuration =
            this.scene.imageProcessingConfiguration;

        configuration.isEnabled = true;

        /*
         * ACES tone mapping
         *
         * Used for the anatomical model.
         */

        configuration.toneMappingEnabled = true;

        configuration.toneMappingType =
            BABYLON.ImageProcessingConfiguration
                .TONEMAPPING_ACES;

        /*
         * Controlled exposure.
         */

        configuration.exposure = 0.72;

        /*
         * Restrained contrast.
         */

        configuration.contrast = 1.08;

    }

    /* ======================================================
     * Camera
     * ====================================================== */

    createCamera() {

        this.camera = new BodyCamera(

            this.scene,

            this.canvas

        );

        this.camera.init();

    }

    /* ======================================================
     * Lights
     * ====================================================== */

    createLights() {

        this.lights = new BodyLights(

            this.scene

        );

        this.lights.init();

    }

    /* ======================================================
     * Rendering Pipeline
     * ====================================================== */

    createRenderPipeline() {

        /*
         * Keep the post-processing deliberately restrained.
         *
         * Medical / premium.
         * No videogame effects.
         */

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
         * Anti-aliasing
         * --------------------------------------------------
         */

        this.renderPipeline.fxaaEnabled = true;

        /*
         * --------------------------------------------------
         * Sharpening
         * --------------------------------------------------
         */

        this.renderPipeline.sharpenEnabled = true;

        this.renderPipeline.sharpen.edgeAmount =
            0.18;

        this.renderPipeline.sharpen.colorAmount =
            0.85;

        /*
         * --------------------------------------------------
         * Disabled cinematic effects
         * --------------------------------------------------
         */

        this.renderPipeline.bloomEnabled = false;

        this.renderPipeline.motionBlurEnabled = false;

        this.renderPipeline.chromaticAberrationEnabled = false;

        this.renderPipeline.grainEnabled = false;

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
                        BABYLON.PointerEventTypes.POINTERPICK
                    ) {

                        return;

                    }

                    const pickInfo =
                        pointerInfo.pickInfo;

                    if (
                        !pickInfo?.hit ||
                        !pickInfo.pickedMesh
                    ) {

                        this.selection.clear();

                        return;

                    }

                    const mesh =
                        pickInfo.pickedMesh;

                    const entity =
                        this.model.getEntityForMesh(
                            mesh
                        );

                    /*
                     * Not every presentation mesh
                     * necessarily maps to an entity.
                     */

                    if (!entity) {

                        this.selection.clear();

                        return;

                    }

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

        if (!this.scene) {

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
         * Remove pointer observer first.
         */

        if (this.pointerObserver) {

            this.scene?.onPointerObservable.remove(

                this.pointerObserver

            );

            this.pointerObserver = null;

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
         * Anatomical model
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
         * Post-processing
         */

        this.renderPipeline?.dispose();

        /*
         * Babylon scene
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

        this.initialized = false;

    }

}
