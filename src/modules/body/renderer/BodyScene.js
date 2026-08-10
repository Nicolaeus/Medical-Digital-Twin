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
         * Clinical background
         * --------------------------------------------------
         *
         * We deliberately do NOT use a transparent scene.
         * The Body Twin needs its own visual environment.
         *
         * This is a deep clinical blue rather than black.
         */

        this.scene.clearColor =
            new BABYLON.Color4(
                0.086,
                0.227,
                0.373,
                1
            );

        /*
         * --------------------------------------------------
         * Image processing
         * --------------------------------------------------
         *
         * This operates on the final rendered image.
         * It does not modify anatomical materials.
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
         *
         * Created after the camera so Babylon can associate
         * the pipeline with the Body Twin camera.
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
         * Automatic framing
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

        /*
         * ACES gives us a much more photographic / clinical
         * response than a raw linear output.
         */

        configuration.toneMappingEnabled = true;

        configuration.toneMappingType =
            BABYLON.ImageProcessingConfiguration
                .TONEMAPPING_ACES;

        /*
         * Slightly lower exposure prevents the pale Z-Anatomy
         * materials from becoming completely white.
         */

        configuration.exposure = 0.82;

        /*
         * A restrained contrast increase helps distinguish
         * adjacent anatomical structures.
         */

        configuration.contrast = 1.12;

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
         * We want:
         *
         *     medical / premium
         *
         * and NOT:
         *
         *     videogame / neon / cinematic.
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
         * Anti-aliasing
         */

        this.renderPipeline.fxaaEnabled = true;

        /*
         * Sharpening gives back a little anatomical detail
         * after tone mapping.
         */

        this.renderPipeline.sharpenEnabled = true;

        this.renderPipeline.sharpen.edgeAmount = 0.18;

        this.renderPipeline.sharpen.colorAmount = 0.85;

        /*
         * Bloom intentionally disabled.
         *
         * Anatomical structures must remain clinically readable.
         */

        this.renderPipeline.bloomEnabled = false;

        /*
         * Motion blur intentionally disabled.
         */

        this.renderPipeline.motionBlurEnabled = false;

        /*
         * Chromatic aberration intentionally disabled.
         */

        this.renderPipeline.chromaticAberrationEnabled = false;

        /*
         * Grain intentionally disabled.
         */

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
                     * Not every mesh in the presentation GLB
                     * necessarily has an anatomical entity.
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
         * Animations are intentionally disabled
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

        this.renderPipeline = null;

        this.selection = null;

        this.animation = null;

        this.model = null;

        this.lights = null;

        this.camera = null;

        this.scene = null;

        this.initialized = false;

    }

}
