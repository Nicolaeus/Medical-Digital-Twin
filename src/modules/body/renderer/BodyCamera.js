/**
 * ==========================================================
 * Medical Digital Twin
 * BodyCamera.js
 * Camera Controller
 * ==========================================================
 */


export default class BodyCamera {

    constructor(scene, canvas) {

        this.scene = scene;

        this.canvas = canvas;

        this.camera = null;

        this.autoRotate = true;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.camera = new BABYLON.ArcRotateCamera(

            "BodyCamera",

            -Math.PI / 2,

            Math.PI / 2.2,

            3,

            BABYLON.Vector3.Zero(),

            this.scene

        );

        this.camera.attachControl(

            this.canvas,

            true

        );

        this.camera.lowerRadiusLimit = 1.2;

        this.camera.upperRadiusLimit = 8;

        this.camera.wheelDeltaPercentage = 0.01;

        this.camera.panningSensibility = 0;

        this.camera.useAutoRotationBehavior = true;

        this.camera.autoRotationBehavior.idleRotationSpeed = 0.12;

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

    reset() {

        this.camera.alpha = -Math.PI / 2;

        this.camera.beta = Math.PI / 2.2;

        this.camera.radius = 3;

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

        this.autoRotate ?

            this.disableAutoRotate()

            :

            this.enableAutoRotate();

    }

    /* ======================================================
     * Focus
     * ====================================================== */

    focus(target) {

        this.camera.setTarget(target);

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getCamera() {

        return this.camera;

    }

}
