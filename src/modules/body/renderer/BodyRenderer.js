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

        this.onResize = null;

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

            this.canvas

        );

        await this.scene.init();

        this.startRenderLoop();

        });

        this.onResize = this.resize.bind(this);

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

        this.canvas = document.createElement(

            "canvas"

        );

        this.canvas.className =

            "body-canvas";

        this.canvas.tabIndex = 1;

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
     * Render Loop
     * ====================================================== */
    
    startRenderLoop() {
    
        this.engine.runRenderLoop(() => {
    
            this.scene?.render();
    
        });
    
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

        this.canvas.style.display = "";

    }

    hide() {

        this.canvas.style.display = "none";

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.engine?.stopRenderLoop();
        
        if (this.onResize) {
        
            window.removeEventListener(
        
                "resize",
        
                this.onResize
        
            );
        
        }

        this.scene?.destroy();

        this.engine?.dispose();

        this.canvas?.remove();

        this.scene = null;

        this.engine = null;

        this.canvas = null;

        this.initialized = false;

        this.container = null;

        this.onResize = null;

    }

}
