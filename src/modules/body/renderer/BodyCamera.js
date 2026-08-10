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
         * Visual framing parameters.
         *
         * These values are intentionally centralized here so
         * that the Body Twin camera can be tuned without
         * touching the model or the renderer.
         */

        this.framingMargin = 1.18;

        this.headerSafeMargin = 0.08;

        this.bottomSafeMargin = 0.08;

        this.minimumRadius = 0.5;

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

        /*
         * --------------------------------------------------
         * Camera projection
         * --------------------------------------------------
         *
         * A moderate FOV gives the body a more clinical
         * presentation and avoids exaggerated perspective.
         */

        this.camera.fov =

            BABYLON.Tools.ToRadians(42);

        /*
         * Keep perspective enabled.
         */

        this.camera.mode =

            BABYLON.Camera.PERSPECTIVE_CAMERA;

        /*
         * --------------------------------------------------
         * Controls
         * --------------------------------------------------
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

        /*
         * Smooth wheel zoom.
         */

        this.camera.wheelDeltaPercentage = 0.01;

        /*
         * No panning for the anatomical viewer.
         */

        this.camera.panningSensibility = 0;

        /*
         * Avoid accidental inertial panning.
         */

        this.camera.panningInertia = 0;

        /*
         * Slightly smooth rotation.
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

        /*
         * --------------------------------------------------
         * Bounds
         * --------------------------------------------------
         */

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
         * --------------------------------------------------
         * Camera target
         * --------------------------------------------------
         *
         * We slightly raise the target so that the complete
         * body sits visually below the application header.
         *
         * This is deliberately small: the model itself should
         * remain centered rather than being artificially moved.
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
         * --------------------------------------------------
         * Fit calculation
         * --------------------------------------------------
         *
         * ArcRotateCamera uses a vertical field of view.
         *
         * We calculate the distance required to contain the
         * complete anatomical bounding sphere.
         */

        const halfFov =

            this.camera.fov / 2;

        const tangent =

            Math.tan(halfFov);

        let requiredRadius =

            radius / tangent;

        /*
         * Additional breathing room.
         *
         * This prevents the body from touching the edge of
         * the viewport and leaves room for future overlays.
         */

        requiredRadius *=

            this.framingMargin;

        /*
         * --------------------------------------------------
         * Aspect-ratio correction
         * --------------------------------------------------
         *
         * On the current Body Twin layout the viewport can be
         * considerably wider than it is tall.
         *
         * We therefore make sure the horizontal field of view
         * can contain the anatomical model as well.
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

            Math.tan(

                horizontalHalfFov

            );

        if (horizontalTangent > 0) {

            requiredRadius = Math.max(

                requiredRadius,

                radius / horizontalTangent

            );

        }

        /*
         * --------------------------------------------------
         * Final radius
         * --------------------------------------------------
         */

        this.camera.radius =

            Math.max(

                requiredRadius,

                this.minimumRadius

            );

        /*
         * --------------------------------------------------
         * Clipping planes
         * --------------------------------------------------
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
         * --------------------------------------------------
         * Normalize orientation
         * --------------------------------------------------
         */

        this.camera.alpha =

            -Math.PI / 2;

        this.camera.beta =

            Math.PI / 2.15;

    }

    /* ======================================================
     * Views
     * ====================================================== */

    front() {

        this.camera.alpha =

            -Math.PI / 2;

    }

    back() {

        this.camera.alpha =

            Math.PI / 2;

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

            -Math.PI / 2;

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
