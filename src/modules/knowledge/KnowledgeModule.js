/**
 * ==========================================================
 * Medical Digital Twin
 * KnowledgeModule.js
 * ==========================================================
 */

export default class KnowledgeModule {

    constructor() {

        this.root = null;

    }

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

            <div class="module-placeholder">

                <h1>📚 Medical Knowledge</h1>

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
