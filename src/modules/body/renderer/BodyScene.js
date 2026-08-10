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

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.scene = new BABYLON.Scene(

            this.engine

        );

        this.scene.clearColor =

            new BABYLON.Color4(

                0,

                0,

                0,

                0

            );

        this.createCamera();

        this.createLights();

        this.model = new BodyModel(

            this.scene

        );

        await this.model.load();

        this.camera.frameModel(

            this.model

        );

        this.selection = new BodySelection({

            model: this.model,

            camera: this.camera

        });

        this.animation = new BodyAnimation({

            scene: this.scene,

            model: this.model

        });

        this.enablePicking();

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

                    if (!entity) {

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

        // Animations are intentionally disabled
        // for the initial interactive prototype.

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

    }

    /* ======================================================
     * Render
     * ====================================================== */

    render() {

        this.animation?.update(

            this.engine.getDeltaTime()

        );

        this.scene.render();

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        if (this.pointerObserver) {

            this.scene?.onPointerObservable.remove(

                this.pointerObserver

            );

        }

        this.selection?.clear();

        this.animation?.clear();

        this.model?.destroy();

        this.lights?.destroy();

        this.scene?.dispose();

    }

}