/**
 * ==========================================================
 * Medical Digital Twin
 * store.js
 * Global Store
 * Version 4.0
 * ==========================================================
 */

class Store {

    constructor() {

        this.state = {};

        this.watchers = new Map();

        this.watcherId = 0;

        this.transactionDepth = 0;

        this.pendingNotifications = new Set();

    }

    /* ====================================================== */

    async init() {

        this.reset();

    }

    /* ====================================================== */

    reset() {

        this.state = {

            patient: {},

            environment: {},

            health: {},

            body: {},

            timeline: {},

            labs: {},

            simulation: {},

            devices: {},

            settings: {},

            ui: {}

        };

        this.pendingNotifications.clear();

    }

    /* ====================================================== */

    get(path = "") {

        if (!path) {

            return this.state;

        }

        return path

            .split(".")

            .reduce(

                (obj, key) => obj?.[key],

                this.state

            );

    }

    /* ====================================================== */

    set(path, value) {

        const keys = path.split(".");

        const last = keys.pop();

        let current = this.state;

        for (const key of keys) {

            if (!(key in current)) {

                current[key] = {};

            }

            current = current[key];

        }

        current[last] = value;

        this.notify(path);

    }

    /* ====================================================== */

    update(path, values) {

        const object = this.get(path);

        if (!object) {

            this.set(path, values);

            return;

        }

        Object.assign(object, values);

        this.notify(path);

    }

    /* ====================================================== */

    watch(path, callback) {

        const id = ++this.watcherId;

        this.watchers.set(id, {

            path,

            callback

        });

        return id;

    }

    /* ====================================================== */

    unwatch(id) {

        this.watchers.delete(id);

    }

    /* ====================================================== */

    transaction(fn) {

        this.transactionDepth++;

        try {

            fn();

        }

        finally {

            this.transactionDepth--;

            if (this.transactionDepth === 0) {

                this.flushNotifications();

            }

        }

    }

    /* ====================================================== */

    notify(path) {

        if (this.transactionDepth > 0) {

            this.pendingNotifications.add(path);

            return;

        }

        this.dispatch(path);

    }

    /* ====================================================== */

    flushNotifications() {

        for (const path of this.pendingNotifications) {

            this.dispatch(path);

        }

        this.pendingNotifications.clear();

    }

    /* ====================================================== */

    dispatch(path) {

        const value = this.get(path);

        this.watchers.forEach(watcher => {

            if (

                watcher.path === path ||

                path.startsWith(watcher.path + ".")

            ) {

                watcher.callback(value, path);

            }

        });

    }

    /* ====================================================== */

    snapshot() {

        return structuredClone(this.state);

    }

    /* ====================================================== */

    restore(snapshot) {

        this.state = structuredClone(snapshot);

        this.dispatch("");

    }

}

export default new Store();
