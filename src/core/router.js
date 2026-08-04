/**
 * ==========================================================
 * Medical Digital Twin
 * router.js
 * Application Router
 * Version 2.0
 * ==========================================================
 */

class Router {

    constructor() {

        this.routes = new Map();

        this.instances = new Map();

        this.currentRoute = null;

        this.currentModule = null;

        this.container = null;

    }

    /**
     * ----------------------------------------------------------
     * Initialize Router
     * ----------------------------------------------------------
     */

    init(container = "#content") {

        this.container = document.querySelector(container);

        if (!this.container) {

            throw new Error(`Router container "${container}" not found.`);

        }

        window.addEventListener(

            "hashchange",

            () => this.handleRoute()

        );

    }

    /**
     * ----------------------------------------------------------
     * Register Module
     * ----------------------------------------------------------
     */

    register(route, ModuleClass) {

        this.routes.set(route, ModuleClass);

    }

    /**
     * ----------------------------------------------------------
     * Register Multiple Routes
     * ----------------------------------------------------------
     */
    
    registerRoutes(routes) {
    
        Object.entries(routes).forEach(
    
            ([route, module]) => {
    
                this.register(route, module);
    
            }
    
        );
    
    }

    /**
     * ----------------------------------------------------------
     * Navigate
     * ----------------------------------------------------------
     */

    async navigate(route) {

        if (this.currentRoute === route) {

            return;

        }

        if (location.hash !== "#" + route) {

            location.hash = route;

            return;

        }

        await this.load(route);

    }

    /**
     * ----------------------------------------------------------
     * Hash Change
     * ----------------------------------------------------------
     */

    async handleRoute() {

        const route =

            location.hash.replace("#", "") ||

            "dashboard";

        await this.load(route);

    }

    /**
     * ----------------------------------------------------------
     * Load Module
     * ----------------------------------------------------------
     */

    async load(route) {

        const ModuleClass = this.routes.get(route);

        if (!ModuleClass) {

            console.warn(`Unknown route "${route}"`);

            return;

        }

        /**
         * Leave current page
         */

        if (

            this.currentModule &&

            typeof this.currentModule.beforeLeave === "function"

        ) {

            await this.currentModule.beforeLeave();

        }

        /**
         * Hide previous module
         */

        if (this.currentModule?.root) {

            this.currentModule.root.style.display = "none";

        }

        /**
         * Create module once
         */

        if (!this.instances.has(route)) {

            const module = new ModuleClass();

            const root = document.createElement("div");

            root.className = "page page-" + route;

            root.dataset.route = route;

            root.style.display = "none";

            this.container.appendChild(root);

            module.root = root;

            this.instances.set(route, module);

        }

        const module = this.instances.get(route);

        /**
         * First render only
         */

        if (!module.initialized) {

            if (typeof module.render === "function") {

                await module.render(module.root);

            }

            if (typeof module.bindEvents === "function") {

                module.bindEvents();

            }

            module.initialized = true;

        }

        /**
         * Show page
         */

        module.root.style.display = "";

        /**
         * Hooks
         */

        if (

            typeof module.beforeEnter === "function"

        ) {

            await module.beforeEnter();

        }

        if (

            typeof module.afterEnter === "function"

        ) {

            await module.afterEnter();

        }


        Store.set(

            "ui.navigation.current",
        
            route
        
        );
        
        /**
         * Save current state
         */

        this.currentRoute = route;

        this.currentModule = module;

        document.body.dataset.page = route;

    }

    /**
     * ----------------------------------------------------------
     * Current Module
     * ----------------------------------------------------------
     */

    getCurrent() {

        return this.currentModule;

    }

    /**
     * ----------------------------------------------------------
     * Route Name
     * ----------------------------------------------------------
     */

    getCurrentRoute() {

        return this.currentRoute;

    }

    /**
     * ----------------------------------------------------------
     * Existing Module
     * ----------------------------------------------------------
     */

    get(route) {

        return this.instances.get(route);

    }

    /**
     * ----------------------------------------------------------
     * Has Module
     * ----------------------------------------------------------
     */

    has(route) {

        return this.instances.has(route);

    }

    /**
     * ----------------------------------------------------------
     * Destroy Module
     * ----------------------------------------------------------
     */

    async destroy(route) {

        const module = this.instances.get(route);

        if (!module) {

            return;

        }

        if (typeof module.destroy === "function") {

            await module.destroy();

        }

        module.root.remove();

        this.instances.delete(route);

    }

    /**
     * ----------------------------------------------------------
     * Destroy All
     * ----------------------------------------------------------
     */

    async destroyAll() {

        for (const route of this.instances.keys()) {

            await this.destroy(route);

        }

    }

}

export default new Router();
