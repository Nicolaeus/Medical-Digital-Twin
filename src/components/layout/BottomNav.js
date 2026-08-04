/**
 * ==========================================================
 * Medical Digital Twin
 * BottomNav.js
 * Floating Bottom Navigation
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

        this.refresh();

    }

    watchStore() {

        this.addWatcher(

            Store.watch(

                "ui.navigation.current",

                () => this.refresh()

            )

        );

    }

    bindEvents() {

        this.element.addEventListener(

            "click",

            event => {

                const button = event.target.closest(

                    ".bottom-nav-item"

                );

                if (!button) {

                    return;

                }

                const page =

                    button.dataset.page;

                Router.navigate(page);

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

                    this.#createItem(

                        item,

                        current

                    )

                ).join("")}

            </div>

        `;

    }

    /* ======================================================
     * Navigation Item
     * ====================================================== */

    #createItem(item, current) {

        const active =

            item.id === current ?

            "active"

            :

            "";

        return `

            <button

                class="bottom-nav-item ${active}"

                data-page="${item.id}"

            >

                <div class="bottom-nav-icon">

                    ${item.icon}

                </div>

                <div class="bottom-nav-label">

                    ${item.label}

                </div>

            </button>

        `;

    }

}
