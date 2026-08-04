/**
 * ==========================================================
 * Medical Digital Twin
 * DashboardModule.js
 * Dashboard = Body Viewport
 * ==========================================================
 */

import BodyModule from "../body/BodyModule.js";

export default class DashboardModule {

    constructor() {

        this.root = null;

        this.body = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

            <main class="dashboard">

                <section class="dashboard-body"></section>

            </main>

        `;

        this.bodyRoot =

            this.root.querySelector(

                ".dashboard-body"

            );

        await this.createBody();

    }

    /* ======================================================
     * Body
     * ====================================================== */

    async createBody() {

        this.body = new BodyModule();

        await this.body.render(

            this.bodyRoot

        );

    }

    /* ======================================================
     * Router Hooks
     * ====================================================== */

    async beforeEnter() {}

    async afterEnter() {}

    async beforeLeave() {}

    /* ======================================================
     * Destroy
     * ====================================================== */

    async destroy() {

        this.body?.destroy?.();

    }

}
