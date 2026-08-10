/**
 * ==========================================================
 * Medical Digital Twin
 * BodyRenderer.js
 * 3D Renderer
 * ==========================================================
 */

import BodyScene from "./BodyScene.js";

export default class BodyRenderer {

    constructor() {

        this.container = null;

        this.canvas = null;

        this.engine = null;

        this.scene = null;

        this.initialized = false;

        this.onResize = null;

        this.resizeObserver = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async render(container) {

        if (this.initialized) {

            return;

        }

        this.container = container;

        this.createCanvas();

        this.createEngine();

        this.scene = new BodyScene(

            this.engine,

            this.canvas,

            this.container

        );

        await this.scene.init();

        /*
         * The scene/model has now been created.
         *
         * At this point the container has its final layout
         * dimensions, so force Babylon to synchronize its
         * internal render buffer with the actual canvas size.
         */

        this.resize();

        /*
         * One additional frame guarantees that CSS layout has
         * settled before the final resize.
         */

        requestAnimationFrame(() => {

            this.resize();

        });

        this.startResizeObserver();

        this.startRenderLoop();

        this.onResize =

            this.resize.bind(this);

        window.addEventListener(

            "resize",

            this.onResize

        );

        this.initialized = true;

    }

    /* ======================================================
     * Canvas
     * ====================================================== */

    createCanvas() {

        this.canvas =

            document.createElement("canvas");

        this.canvas.className =

            "body-canvas";

        this.canvas.tabIndex = 1;

        this.canvas.style.width = "100%";

        this.canvas.style.height = "100%";

        this.canvas.style.display = "block";

        this.canvas.style.outline = "none";

        this.canvas.style.touchAction = "none";

        this.container.appendChild(

            this.canvas

        );

    }

    /* ======================================================
     * Engine
     * ====================================================== */

    createEngine() {

        this.engine =

            new BABYLON.Engine(

                this.canvas,

                true,

                {

                    preserveDrawingBuffer: true,

                    stencil: true,

                    antialias: true

                },

                true

            );

        /*
         * The fourth argument enables device-pixel-ratio
         * adaptation.
         *
         * This is important on high-DPI displays because the
         * CSS dimensions and the actual GPU render buffer are
         * not necessarily the same.
         */

        this.engine.resize();

    }

    /* ======================================================
     * Resize Observer
     * ====================================================== */

    startResizeObserver() {

        if (!this.container) {

            return;

        }

        if (

            typeof ResizeObserver ===

            "undefined"

        ) {

            return;

        }

        this.resizeObserver =

            new ResizeObserver(() => {

                this.resize();

            });

        this.resizeObserver.observe(

            this.container

        );

    }

    /* ======================================================
     * Render Loop
     * ====================================================== */

    startRenderLoop() {

        this.engine.runRenderLoop(

            () => {

                this.scene?.render();

            }

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.scene?.refresh();

        this.resize();

    }

    /* ======================================================
     * Resize
     * ====================================================== */

    resize() {

        if (!this.engine) {

            return;

        }

        this.engine.resize();

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        if (this.canvas) {

            this.canvas.style.display = "block";

            requestAnimationFrame(() => {

                this.resize();

            });

        }

    }

    hide() {

        if (this.canvas) {

            this.canvas.style.display = "none";

        }

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        /*
         * Stop Babylon render loop.
         */

        this.engine?.stopRenderLoop();

        /*
         * Remove window resize listener.
         */

        if (this.onResize) {

            window.removeEventListener(

                "resize",

                this.onResize

            );

        }

        /*
         * Disconnect ResizeObserver.
         */

        this.resizeObserver?.disconnect();

        this.resizeObserver = null;

        /*
         * Destroy scene.
         */

        this.scene?.destroy();

        /*
         * Dispose engine.
         */

        this.engine?.dispose();

        /*
         * Remove canvas.

         */

        this.canvas?.remove();

        /*
         * Reset state.
         */

        this.scene = null;

        this.engine = null;

        this.canvas = null;

        this.initialized = false;

        this.container = null;

        this.onResize = null;

    }

}
