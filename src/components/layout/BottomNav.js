/**
 * ==========================================================
 * Medical Digital Twin
 * BottomNav.js
 * Floating Dock
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";
import Store from "../../core/store.js";
import Router from "../../core/router.js";
import Navigation from "../../config/navigation.js";

export default class BottomNav extends BaseComponent {

    constructor() {

        super({

            id: "bottom-nav"

        });

        this.items = Navigation;

    }

    /* ======================================================
     * Lifecycle
     * ====================================================== */

    async render() {

        this.element = document.createElement("nav");

        this.element.className = "bottom-nav";

        this.watchStore();

        this.bindEvents();

        this.refresh();

    }

    /* ======================================================
     * Store
     * ====================================================== */

    watchStore() {

        this.addWatcher(

            Store.watch(

                "ui.navigation.current",

                () => this.refresh()

            )

        );

    }

    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        this.element.addEventListener(

            "click",

            event => {

                const button = event.target.closest(

                    ".bottom-nav-button"

                );

                if (!button) {

                    return;

                }

                Router.navigate(

                    button.dataset.route

                );

            }

        );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        const current =

            Store.get(

                "ui.navigation.current"

            ) || "dashboard";

        this.element.innerHTML = `

            <div class="bottom-nav-container">

                ${this.items.map(item =>

                    this.#createButton(

                        item,

                        current

                    )

                ).join("")}

            </div>

        `;

    }

    /* ======================================================
     * Button
     * ====================================================== */

    #createButton(item, current) {

        const active =

            item.id === current;

        return `

            <button

                class="bottom-nav-button ${active ? "active" : ""}"

                data-id="${item.id}"

                data-route="${item.route}"

                aria-label="${item.label}"

            >

                <div class="bottom-nav-icon">

                    ${item.icon}

                </div>

                ${active ? `

                    <div class="bottom-nav-label">

                        ${item.label}

                    </div>

                ` : ""}

            </button>

        `;

    }

    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        this.element.classList.remove(

            "hidden"

        );

        this.element.classList.add(

            "show"

        );

    }

    hide() {

        this.element.classList.remove(

            "show"

        );

        this.element.classList.add(

            "hidden"

        );

    }

}
