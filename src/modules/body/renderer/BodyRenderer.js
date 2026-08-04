/**
 * ==========================================================
 * Medical Digital Twin
 * BodyRenderer.js
 * 3D Renderer
 * ==========================================================
 */

import * as BABYLON from "@babylonjs/core";

import BodyScene from "./BodyScene.js";

export default class BodyRenderer {

    constructor() {

        this.container = null;

        this.canvas = null;

        this.engine = null;

        this.scene = null;

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(container) {

        if (this.initialized) {

            return;

        }

        this.container = container;

        this.createCanvas();

        this.createEngine();

        this.scene = new BodyScene(

            this.engine,

            this.canvas

        );

        await this.scene.init();

        this.engine.runRenderLoop(() => {

            this.scene.render();

        });

        window.addEventListener(

            "resize",

            () => this.resize()

        );

        this.initialized = true;

    }

    /* ======================================================
     * Canvas
     * ====================================================== */

    createCanvas() {

        this.canvas = document.createElement(

            "canvas"

        );

        this.canvas.className =

            "body-canvas";

        this.container.appendChild(

            this.canvas

        );

    }

    /* ======================================================
     * Engine
     * ====================================================== */

    createEngine() {

        this.engine = new BABYLON.Engine(

            this.canvas,

            true,

            {

                preserveDrawingBuffer: true,

                stencil: true,

                antialias: true

            }

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.scene?.refresh();

    }

    /* ======================================================
     * Resize
     * ====================================================== */

    resize() {

        this.engine?.resize();

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.canvas.hidden = false;

    }

    hide() {

        this.canvas.hidden = true;

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.scene?.destroy();

        this.engine?.dispose();

        this.canvas?.remove();

        this.scene = null;

        this.engine = null;

        this.canvas = null;

        this.initialized = false;

    }

}
