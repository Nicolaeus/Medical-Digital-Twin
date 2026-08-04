/**
 * ==========================================================
 * Medical Digital Twin
 * LayerToolbar.js
 * Floating Body Toolbar
 * ==========================================================
 */

import BaseComponent from "../base/BaseComponent.js";

export default class LayerToolbar extends BaseComponent {

    constructor() {

        super({

            id: "layer-toolbar"

        });

        this.controls = null;

        this.buttons = [

            {
                id: "rotation",
                icon: "🔄",
                title: "Auto Rotation"
            },

            {
                id: "ghost",
                icon: "👻",
                title: "Ghost Mode"
            },

            {
                id: "skin",
                icon: "👤",
                title: "Skin"
            },

            {
                id: "skeleton",
                icon: "🦴",
                title: "Skeleton"
            },

            {
                id: "muscles",
                icon: "💪",
                title: "Muscles"
            },

            {
                id: "organs",
                icon: "❤️",
                title: "Organs"
            },

            {
                id: "vessels",
                icon: "🩸",
                title: "Blood Vessels"
            },

            {
                id: "nerves",
                icon: "🧠",
                title: "Nervous System"
            },

            {
                id: "devices",
                icon: "⚙️",
                title: "Medical Devices"
            },

            {
                id: "imaging",
                icon: "🩻",
                title: "Medical Imaging"
            }

        ];

    }

    /* ======================================================
     * Controls
     * ====================================================== */

    setControls(controls) {

        this.controls = controls;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element = document.createElement(

            "aside"

        );

        this.element.className =

            "layer-toolbar";

        this.refresh();

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.setHTML(

            this.buttons.map(

                button => this.buttonHTML(button)

            ).join("")

        );

        this.bindEvents();

    }

    /* ======================================================
     * Button
     * ====================================================== */

    buttonHTML(button) {

        return `

<button

class="layer-button"

data-action="${button.id}"

title="${button.title}"

>

${button.icon}

</button>

`;

    }

    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        this.element

            .querySelectorAll(

                ".layer-button"

            )

            .forEach(button => {

                button.onclick = () => {

                    this.execute(

                        button.dataset.action

                    );

                };

            });

    }

    /* ======================================================
     * Execute
     * ====================================================== */

    execute(action) {

        if (!this.controls) {

            return;

        }

        switch (action) {

            case "rotation":

                this.controls.toggleRotation();

                break;

            case "ghost":

                this.controls.enableGhostMode();

                break;

            case "skin":

                this.controls.showSkin();

                break;

            case "skeleton":

                this.controls.showSkeleton();

                break;

            case "muscles":

                this.controls.showMuscles();

                break;

            case "organs":

                this.controls.showOrgans();

                break;

            case "vessels":

                this.controls.showVessels();

                break;

            case "nerves":

                this.controls.showNerves();

                break;

            case "devices":

                this.controls.showDevices();

                break;

            case "imaging":

                this.controls.showImaging();

                break;

        }

    }

}
