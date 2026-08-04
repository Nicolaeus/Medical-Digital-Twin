/**
 * ==========================================================
 * Medical Digital Twin
 * AIService.js
 * Artificial Intelligence Service
 * ==========================================================
 */

class AIService {

    constructor() {

        this.provider = null;

        this.models = [];

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(provider = null) {

        this.provider = provider;

        this.initialized = true;

    }

    /* ======================================================
     * Provider
     * ====================================================== */

    setProvider(provider) {

        this.provider = provider;

    }

    getProvider() {

        return this.provider;

    }

    /* ======================================================
     * Availability
     * ====================================================== */

    isAvailable() {

        return this.provider !== null;

    }

    /* ======================================================
     * Chat
     * ====================================================== */

    async chat(messages, options = {}) {

        if (!this.provider) {

            throw new Error("No AI provider configured.");

        }

        return this.provider.chat(

            messages,

            options

        );

    }

    /* ======================================================
     * Prompt
     * ====================================================== */

    async prompt(prompt, options = {}) {

        return this.chat(

            [

                {

                    role: "user",

                    content: prompt

                }

            ],

            options

        );

    }

    /* ======================================================
     * Embeddings
     * ====================================================== */

    async embedding(text) {

        if (!this.provider?.embedding) {

            return null;

        }

        return this.provider.embedding(text);

    }

    /* ======================================================
     * Models
     * ====================================================== */

    async getModels() {

        if (!this.provider?.getModels) {

            return [];

        }

        return this.provider.getModels();

    }

    /* ======================================================
     * Health Check
     * ====================================================== */

    async ping() {

        if (!this.provider?.ping) {

            return false;

        }

        return this.provider.ping();

    }

}

export default new AIService();
