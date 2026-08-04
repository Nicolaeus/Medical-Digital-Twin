/**
 * ==========================================================
 * Medical Digital Twin
 * DashboardModule.js
 * Dashboard Module
 * ==========================================================
 */

import Header from "../../components/layout/Header.js";
import BottomNav from "../../components/layout/BottomNav.js";

import LayerToolbar from "../../components/body/LayerToolbar.js";
import OrganWidget from "../../components/body/OrganWidget.js";
import LegendWidget from "../../components/body/LegendWidget.js";

import BodyModule from "../body/BodyModule.js";

export default class DashboardModule {

    constructor() {

        this.header = null;

        this.body = null;

        this.toolbar = null;

        this.organWidget = null;

        this.legendWidget = null;

        this.bottomNav = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

<div class="dashboard">

    <header class="dashboard-header"></header>

    <main class="dashboard-body"></main>

    <aside class="dashboard-toolbar"></aside>

    <aside class="dashboard-organ"></aside>

    <aside class="dashboard-legend"></aside>

    <footer class="dashboard-bottomnav"></footer>

</div>

`;

        this.cacheDOM();

        await this.createHeader();

        await this.createBody();

        await this.createToolbar();

        await this.createWidgets();

        await this.createBottomNav();

    }

    /* ======================================================
     * Cache DOM
     * ====================================================== */

    cacheDOM() {

        this.headerRoot =
            this.root.querySelector(
                ".dashboard-header"
            );

        this.bodyRoot =
            this.root.querySelector(
                ".dashboard-body"
            );

        this.toolbarRoot =
            this.root.querySelector(
                ".dashboard-toolbar"
            );

        this.organRoot =
            this.root.querySelector(
                ".dashboard-organ"
            );

        this.legendRoot =
            this.root.querySelector(
                ".dashboard-legend"
            );

        this.bottomRoot =
            this.root.querySelector(
                ".dashboard-bottomnav"
            );

    }

    /* ======================================================
     * Header
     * ====================================================== */

    async createHeader() {

        this.header = new Header();

        await this.header.render();

        this.headerRoot.appendChild(
            this.header.element
        );

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
     * Toolbar
     * ====================================================== */

    async createToolbar() {

        this.toolbar = new LayerToolbar();

        this.toolbar.setControls(
            this.body.controls
        );

        await this.toolbar.render();

        this.toolbarRoot.appendChild(
            this.toolbar.element
        );

    }

    /* ======================================================
     * Widgets
     * ====================================================== */

    async createWidgets() {

        this.organWidget = new OrganWidget();

        await this.organWidget.render();

        this.organRoot.appendChild(
            this.organWidget.element
        );

        this.legendWidget = new LegendWidget();

        await this.legendWidget.render();

        this.legendRoot.appendChild(
            this.legendWidget.element
        );

    }

    /* ======================================================
     * Bottom Navigation
     * ====================================================== */

    async createBottomNav() {

        this.bottomNav = new BottomNav();

        await this.bottomNav.render();

        this.bottomRoot.appendChild(
            this.bottomNav.element
        );

    }

    /* ======================================================
     * Router Hooks
     * ====================================================== */

    bindEvents() {

        //
        // Dashboard events
        //

    }

    async beforeEnter() {}

    async afterEnter() {}

    async beforeLeave() {}

    async destroy() {

        this.header?.destroy?.();

        this.body?.destroy?.();

        this.toolbar?.destroy?.();

        this.organWidget?.destroy?.();

        this.legendWidget?.destroy?.();

        this.bottomNav?.destroy?.();

    }

}
