/**
 * ==========================================================
 * Medical Digital Twin
 * core/store.js
 * Global Reactive Store
 * Version 5.0
 * ==========================================================
 */
import State from "../states/index.js";
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

        this.state = structuredClone(State);

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

    has(path) {

        return this.get(path) !== undefined;

    }

    /* ====================================================== */

    set(path, value) {

        const keys = path.split(".");

        const last = keys.pop();

        let current = this.state;

        for (const key of keys) {

            if (!(key in current) || typeof current[key] !== "object") {

                current[key] = {};

            }

            current = current[key];

        }

        current[last] = structuredClone(value);

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

    merge(path, values) {

        const target = this.get(path);

        if (!target) {

            this.set(path, structuredClone(values));

            return;

        }

        this.#deepMerge(target, values);

        this.notify(path);

    }

    /* ====================================================== */
    
    #deepMerge(target, source) {
    
        const isPlainObject = value =>
    
            value !== null &&
    
            value.constructor === Object;
    
        Object.keys(source).forEach(key => {
    
            const value = source[key];
    
            if (isPlainObject(value)) {
    
                if (!isPlainObject(target[key])) {
    
                    target[key] = {};
    
                }
    
                this.#deepMerge(
    
                    target[key],
    
                    value
    
                );
    
            }
    
            else {
    
                target[key] = structuredClone(value);
    
            }
    
        });
    
    }

    /* ====================================================== */

    delete(path) {

        const keys = path.split(".");

        const last = keys.pop();

        let object = this.state;

        for (const key of keys) {

            object = object?.[key];

        }

        if (

            object &&

            last in object

        ) {

            delete object[last];

            this.notify(path);

        }

    }

    /* ====================================================== */

    clear(path) {

        const value = this.get(path);

        if (Array.isArray(value)) {

            value.length = 0;

        }

        else if (

            value &&

            typeof value === "object"

        ) {

            Object.keys(value).forEach(

                key => delete value[key]

            );

        }

        this.notify(path);

    }

    /* ====================================================== */

    push(path, item) {

        const array = this.get(path);

        if (!Array.isArray(array)) {

            throw new Error(

                `${path} is not an array.`

            );

        }

        array.push(item);

        this.notify(path);

    }

    /* ====================================================== */

    remove(path, index) {

        const array = this.get(path);

        if (!Array.isArray(array)) {

            return;

        }

        array.splice(index, 1);

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

            if (

                this.transactionDepth === 0

            ) {

                this.flushNotifications();

            }

        }

    }

    /* ====================================================== */

    notify(path) {

        if (

            this.transactionDepth > 0

        ) {

            this.pendingNotifications.add(path);

            return;

        }

        this.dispatch(path);

    }

    /* ====================================================== */

    flushNotifications() {

        this.pendingNotifications.forEach(

            path => this.dispatch(path)

        );

        this.pendingNotifications.clear();

    }

    /* ====================================================== */
    
    dispatch(path) {
    
        const value = this.get(path);
    
        this.watchers.forEach(watcher => {
    
            if (
    
                watcher.path === "*" ||
    
                watcher.path === path ||
    
                (path && path.startsWith(watcher.path + "."))
    
            ) {
    
                watcher.callback(
    
                    value,
    
                    path
    
                );
    
            }
    
        });
    
    }

    /* ====================================================== */

    keys(path = "") {

        const object = this.get(path);

        if (

            !object ||

            typeof object !== "object"

        ) {

            return [];

        }

        return Object.keys(object);

    }

    /* ====================================================== */

    clone(path = "") {

        return structuredClone(

            this.get(path)

        );

    }

    /* ====================================================== */

    snapshot() {

        return structuredClone(

            this.state

        );

    }

    /* ====================================================== */

    restore(snapshot) {

        this.state = structuredClone(snapshot);

        Object.keys(this.state).forEach(path => {

            this.dispatch(path);
        
        });

    }

}

export default new Store();
