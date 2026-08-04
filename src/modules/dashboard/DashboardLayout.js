/**
 * ==========================================================
 * Medical Digital Twin
 * DashboardLayout.js
 * Dashboard Layout Manager
 * ==========================================================
 */

export default class DashboardLayout {

    constructor(container) {

        this.container = container;

        this.root = null;

        this.header = null;

        this.body = null;

        this.toolbar = null;

        this.organ = null;

        this.legend = null;

        this.bottomNav = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.root = document.createElement(

            "div"

        );

        this.root.id = "dashboard";

        this.root.className =

            "dashboard";

        this.createHeader();

        this.createBody();

        this.createToolbar();

        this.createOrganWidget();

        this.createLegendWidget();

        this.createBottomNav();

        this.container.appendChild(

            this.root

        );

    }

    /* ======================================================
     * Header
     * ====================================================== */

    createHeader() {

        this.header = document.createElement(

            "header"

        );

        this.header.id =

            "dashboard-header";

        this.root.appendChild(

            this.header

        );

    }

    /* ======================================================
     * Body
     * ====================================================== */

    createBody() {

        this.body = document.createElement(

            "main"

        );

        this.body.id =

            "dashboard-body";

        this.root.appendChild(

            this.body

        );

    }

    /* ======================================================
     * Toolbar
     * ====================================================== */

    createToolbar() {

        this.toolbar = document.createElement(

            "aside"

        );

        this.toolbar.id =

            "dashboard-toolbar";

        this.root.appendChild(

            this.toolbar

        );

    }

    /* ======================================================
     * Organ Widget
     * ====================================================== */

    createOrganWidget() {

        this.organ = document.createElement(

            "aside"

        );

        this.organ.id =

            "dashboard-organ";

        this.root.appendChild(

            this.organ

        );

    }

    /* ======================================================
     * Legend Widget
     * ====================================================== */

    createLegendWidget() {

        this.legend = document.createElement(

            "aside"

        );

        this.legend.id =

            "dashboard-legend";

        this.root.appendChild(

            this.legend

        );

    }

    /* ======================================================
     * Bottom Navigation
     * ====================================================== */

    createBottomNav() {

        this.bottomNav =

            document.createElement(

                "footer"

            );

        this.bottomNav.id =

            "dashboard-bottomnav";

        this.root.appendChild(

            this.bottomNav

        );

    }

    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.root?.remove();

    }

}
