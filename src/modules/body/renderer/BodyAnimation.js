/**
 * ==========================================================
 * Medical Digital Twin
 * BodyAnimation.js
 * Animation Manager
 * ==========================================================
 */

export default class BodyAnimation {

    constructor({

        scene,

        model

    } = {}) {

        this.scene = scene;

        this.model = model;

        this.running = new Map();

    }

    /* ======================================================
     * Play
     * ====================================================== */

    play(name) {

        switch (name) {

            case "rotation":

                this.startRotation();

                break;

            case "breathing":

                this.startBreathing();

                break;

            case "heartbeat":

                this.startHeartbeat();

                break;

            default:

                console.warn(

                    `Unknown animation: ${name}`

                );

        }

    }

    /* ======================================================
     * Stop
     * ====================================================== */

    stop(name) {

        this.running.delete(name);

    }

    /* ======================================================
     * Pause
     * ====================================================== */

    pause(name) {

        this.running.set(

            name,

            false

        );

    }

    /* ======================================================
     * Resume
     * ====================================================== */

    resume(name) {

        this.running.set(

            name,

            true

        );

    }

    /* ======================================================
     * Rotation
     * ====================================================== */

    startRotation() {

        this.running.set(

            "rotation",

            true

        );

    }

    /* ======================================================
     * Breathing
     * ====================================================== */

    startBreathing() {

        this.running.set(

            "breathing",

            true

        );

    }

    /* ======================================================
     * Heartbeat
     * ====================================================== */

    startHeartbeat() {

        this.running.set(

            "heartbeat",

            true

        );

    }

    /* ======================================================
     * Update
     * ====================================================== */

    update(deltaTime) {

        if (

            this.running.get(

                "rotation"

            )

        ) {

            this.updateRotation(

                deltaTime

            );

        }

        if (

            this.running.get(

                "breathing"

            )

        ) {

            this.updateBreathing(

                deltaTime

            );

        }

        if (

            this.running.get(

                "heartbeat"

            )

        ) {

            this.updateHeartbeat(

                deltaTime

            );

        }

    }

    /* ======================================================
     * Rotation Update
     * ====================================================== */

    updateRotation(deltaTime) {

        const root =

            this.model?.getRoot();

        if (!root) {

            return;

        }

        root.rotation.y +=

            deltaTime * 0.0002;

    }

    /* ======================================================
     * Breathing Update
     * ====================================================== */

    updateBreathing(deltaTime) {

        //
        // TODO
        //

    }

    /* ======================================================
     * Heartbeat Update
     * ====================================================== */

    updateHeartbeat(deltaTime) {

        //
        // TODO
        //

    }

    /* ======================================================
     * Helpers
     * ====================================================== */

    isRunning(name) {

        return this.running.get(name);

    }

    clear() {

        this.running.clear();

    }

}
