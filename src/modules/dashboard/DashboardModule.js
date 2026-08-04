/**
 * ==========================================================
 * Medical Digital Twin
 * DashboardModule.js
 * Main Dashboard
 * ==========================================================
 */

import Header from "../../components/layout/Header.js";
import BottomNav from "../../components/layout/BottomNav.js";

import LayerToolbar from "../../components/body/LayerToolbar.js";
import OrganWidget from "../../components/body/OrganWidget.js";
import LegendWidget from "../../components/body/LegendWidget.js";

import BodyModule from "../body/BodyModule.js";

export default class DashboardModule {

    constructor(container) {

        this.container = container;

        this.layout = null;

        this.header = null;

        this.body = null;

        this.toolbar = null;

        this.organWidget = null;

        this.legendWidget = null;

        this.bottomNav = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        this.createLayout();

        await this.createHeader();

        await this.createBody();

        await this.createToolbar();

        await this.createWidgets();

        await this.createBottomNavigation();

    }

    /* ======================================================
     * Layout
     * ====================================================== */

    createLayout() {

        this.container.innerHTML = `

<div id="dashboard">

    <header id="dashboard-header"></header>

    <main id="dashboard-body"></main>

    <aside id="dashboard-toolbar"></aside>

    <aside id="dashboard-organ"></aside>

    <aside id="dashboard-legend"></aside>

    <footer id="dashboard-bottomnav"></footer>

</div>

`;

    }

    /* ======================================================
     * Header
     * ====================================================== */

    async createHeader() {

        this.header = new Header();

        await this.header.render();

        document

            .getElementById(

                "dashboard-header"

            )

            .appendChild(

                this.header.element

            );

    }

    /* ======================================================
     * Body
     * ====================================================== */

    async createBody() {

        this.body = new BodyModule();

        await this.body.init(

            document.getElementById(

                "dashboard-body"

            )

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

        document

            .getElementById(

                "dashboard-toolbar"

            )

            .appendChild(

                this.toolbar.element

            );

    }

    /* ======================================================
     * Widgets
     * ====================================================== */

    async createWidgets() {

        this.organWidget =

            new OrganWidget();

        await this.organWidget.init();

        await this.organWidget.render();

        document

            .getElementById(

                "dashboard-organ"

            )

            .appendChild(

                this.organWidget.element

            );

        this.legendWidget =

            new LegendWidget();

        await this.legendWidget.render();

        document

            .getElementById(

                "dashboard-legend"

            )

            .appendChild(

                this.legendWidget.element

            );

    }

    /* ======================================================
     * Navigation
     * ====================================================== */

    async createBottomNavigation() {

        this.bottomNav =

            new BottomNav();

        await this.bottomNav.render();

        document

            .getElementById(

                "dashboard-bottomnav"

            )

            .appendChild(

                this.bottomNav.element

            );

    }

}
