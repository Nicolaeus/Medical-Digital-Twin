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

        /*
         * Visual framing
         */

        this.framingMargin = 1.30;

        this.headerSafeMargin = 0.06;

        this.bottomSafeMargin = 0.06;

        this.minimumRadius = 0.5;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.camera = new BABYLON.ArcRotateCamera(

            "BodyCamera",

            Math.PI / 2,

            Math.PI / 2.15,

            3,

            BABYLON.Vector3.Zero(),

            this.scene

        );

        /*
         * Moderate perspective.
         */

        this.camera.fov =
            BABYLON.Tools.ToRadians(42);

        this.camera.mode =
            BABYLON.Camera.PERSPECTIVE_CAMERA;

        /*
         * Controls
         */

        this.camera.attachControl(
            this.canvas,
            true
        );

        /*
         * Zoom limits
         */

        this.camera.lowerRadiusLimit = 0.05;

        this.camera.upperRadiusLimit = 20;

        this.camera.wheelDeltaPercentage = 0.01;

        /*
         * No panning.
         */

        this.camera.panningSensibility = 0;

        this.camera.panningInertia = 0;

        /*
         * Smooth rotation.
         */

        this.camera.inertia = 0.75;

        this.disableAutoRotate();

    }

    /* ======================================================
     * Frame Model
     * ====================================================== */

    frameModel(model) {

        const bounds =
            model?.getBounds();

        if (!bounds || !this.camera) {

            return;

        }

        const center =
            bounds.center.clone();

        const radius =
            Math.max(
                Number(bounds.radius) || 0,
                0.001
            );

        const dimensions =
            bounds.dimensions
                ? bounds.dimensions.clone()
                : new BABYLON.Vector3(
                    radius * 2,
                    radius * 2,
                    radius * 2
                );

        /*
         * Slightly raise the target.
         *
         * This keeps the complete body visually below the
         * application header.
         */

        const targetOffset =
            dimensions.y *
            this.headerSafeMargin;

        this.camera.target =
            center.add(
                new BABYLON.Vector3(
                    0,
                    targetOffset,
                    0
                )
            );

        /*
         * Vertical fit.
         */

        const halfFov =
            this.camera.fov / 2;

        const tangent =
            Math.tan(halfFov);

        let requiredRadius =
            radius / tangent;

        /*
         * Breathing room around the body.
         */

        requiredRadius *=
            this.framingMargin;

        /*
         * Horizontal fit.
         */

        const width =
            Math.max(
                this.canvas?.clientWidth || 1,
                1
            );

        const height =
            Math.max(
                this.canvas?.clientHeight || 1,
                1
            );

        const aspect =
            width / height;

        const horizontalHalfFov =
            Math.atan(
                Math.tan(halfFov) *
                aspect
            );

        const horizontalTangent =
            Math.tan(horizontalHalfFov);

        if (horizontalTangent > 0) {

            requiredRadius = Math.max(
                requiredRadius,
                radius / horizontalTangent
            );

        }

        /*
         * Final camera distance.
         */

        this.camera.radius =
            Math.max(
                requiredRadius,
                this.minimumRadius
            );

        /*
         * Clipping planes.
         */

        this.camera.minZ =
            Math.max(
                radius * 0.001,
                0.001
            );

        this.camera.maxZ =
            Math.max(
                radius * 100,
                100
            );

        /*
         * FRONT VIEW
         *
         * Z-Anatomy model orientation:
         * +PI / 2 = anterior
         * -PI / 2 = posterior
         */

        this.camera.alpha =
            Math.PI / 2;

        this.camera.beta =
            Math.PI / 2.15;

    }

    /* ======================================================
     * Views
     * ====================================================== */

    front() {

        this.camera.alpha =
            Math.PI / 2;

    }

    back() {

        this.camera.alpha =
            -Math.PI / 2;

    }

    left() {

        this.camera.alpha =
            Math.PI;

    }

    right() {

        this.camera.alpha =
            0;

    }

    top() {

        this.camera.beta =
            0.15;

    }

    /* ======================================================
     * Zoom
     * ====================================================== */

    zoom(distance) {

        if (!this.camera) {

            return;

        }

        this.camera.radius =
            Math.max(
                this.camera.lowerRadiusLimit,
                Math.min(
                    distance,
                    this.camera.upperRadiusLimit
                )
            );

    }

    /* ======================================================
     * Reset
     * ====================================================== */

    reset(model = null) {

        if (!this.camera) {

            return;

        }

        this.camera.alpha =
            Math.PI / 2;

        this.camera.beta =
            Math.PI / 2.15;

        if (model) {

            this.frameModel(model);

        }

    }

    /* ======================================================
     * Auto Rotation
     * ====================================================== */

    enableAutoRotate() {

        this.autoRotate = true;

        this.camera.useAutoRotationBehavior =
            true;

    }

    disableAutoRotate() {

        this.autoRotate = false;

        this.camera.useAutoRotationBehavior =
            false;

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

        if (!target || !this.camera) {

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
