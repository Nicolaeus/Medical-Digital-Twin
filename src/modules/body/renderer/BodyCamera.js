/**
 * ==========================================================
 * Medical Digital Twin
 * BodyCamera.js
 * Body Twin Camera Controller
 * ==========================================================
 */

export default class BodyCamera {

    constructor(scene, canvas) {

        this.scene = scene;

        this.canvas = canvas;

        this.camera = null;

        this.autoRotate = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.camera = new BABYLON.ArcRotateCamera(

            "BodyCamera",

            -Math.PI / 2,

            Math.PI / 2.15,

            3,

            BABYLON.Vector3.Zero(),

            this.scene

        );

        this.camera.attachControl(

            this.canvas,

            true

        );

        this.camera.lowerRadiusLimit = 0.05;

        this.camera.upperRadiusLimit = 20;

        this.camera.wheelDeltaPercentage = 0.01;

        this.camera.panningSensibility = 0;

        this.disableAutoRotate();

    }

    /* ======================================================
     * Frame Model
     * ====================================================== */

    frameModel(model) {

        const bounds =

            model?.getBounds();

        if (!bounds) {

            return;

        }

        this.camera.target =

            bounds.center.clone();

        this.camera.radius =

            Math.max(

                bounds.radius * 2.4,

                0.5

            );

        this.camera.minZ =

            Math.max(

                bounds.radius * 0.001,

                0.001

            );

        this.camera.maxZ =

            Math.max(

                bounds.radius * 100,

                100

            );

    }

    /* ======================================================
     * Views
     * ====================================================== */

    front() {

        this.camera.alpha = -Math.PI / 2;

    }

    back() {

        this.camera.alpha = Math.PI / 2;

    }

    left() {

        this.camera.alpha = Math.PI;

    }

    right() {

        this.camera.alpha = 0;

    }

    top() {

        this.camera.beta = 0.15;

    }

    /* ======================================================
     * Zoom
     * ====================================================== */

    zoom(distance) {

        this.camera.radius = distance;

    }

    reset(model = null) {

        this.camera.alpha = -Math.PI / 2;

        this.camera.beta = Math.PI / 2.15;

        if (model) {

            this.frameModel(model);

        }

    }

    /* ======================================================
     * Auto Rotation
     * ====================================================== */

    enableAutoRotate() {

        this.autoRotate = true;

        this.camera.useAutoRotationBehavior = true;

    }

    disableAutoRotate() {

        this.autoRotate = false;

        this.camera.useAutoRotationBehavior = false;

    }

    toggleAutoRotate() {

        this.autoRotate

            ? this.disableAutoRotate()

            : this.enableAutoRotate();

    }

    /* ======================================================
     * Focus
     * ====================================================== */

    focus(target) {

        if (!target) {

            return;

        }

        this.camera.setTarget(

            target

        );

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getCamera() {

        return this.camera;

    }

}