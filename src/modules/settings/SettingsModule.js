/**
 * ==========================================================
 * Medical Digital Twin
 * SettingsModule.js
 * ==========================================================
 */

export default class SettingsModule {

    constructor() {

        this.root = null;

    }

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

            <div class="module-placeholder">

                <h1>⚙️ Settings</h1>

                <p>Module en cours de développement.</p>

            </div>

        `;

    }

    bindEvents() {}

    async beforeEnter() {}

    async afterEnter() {}

    async beforeLeave() {}

    async destroy() {}

}
