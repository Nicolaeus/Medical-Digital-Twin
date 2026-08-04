/**
 * ==========================================================
 * Medical Digital Twin
 * EnvironmentModule.js
 * ==========================================================
 */

export default class EnvironmentModule {

    constructor() {

        this.root = null;

    }

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

            <div class="module-placeholder">

                <h1>🌍 Environment</h1>

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
