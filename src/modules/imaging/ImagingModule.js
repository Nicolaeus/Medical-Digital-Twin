/**
 * ==========================================================
 * Medical Digital Twin
 * ImagingModule.js
 * ==========================================================
 */

export default class ImagingModule {

    constructor() {

        this.root = null;

    }

    async render(root) {

        this.root = root;

        this.root.innerHTML = `

            <div class="module-placeholder">

                <h1>🩻 Medical Imaging</h1>

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
