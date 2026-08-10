/**
 * ==========================================================
 * Medical Digital Twin
 * ClinicalCard.js
 * Anatomical Clinical Information Card
 * ==========================================================
 */

import Card from "../../../components/base/Card.js";

export default class ClinicalCard extends Card {

    constructor(options = {}) {

        super({

            ...options,

            title:
                options.title ||
                "Informations cliniques",

            icon:
                options.icon ||
                "◉"

        });

        this.entity = null;

        this.opened = false;

        this.selectionHandler = null;

        this.clearHandler = null;

    }


    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        if (this.initialized) {

            return;

        }

        await this.render();

        this.bindEvents();

        this.initialized =
            true;

    }


    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        this.element =
            document.createElement(
                "aside"
            );

        this.element.className =
            "clinical-card";

        this.element.hidden =
            true;

        this.refresh();

    }


    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        /*
         * Anatomical selection from the 3D model.
         */

        this.selectionHandler =
            event => {

                this.open(
                    event.detail
                );

            };

        window.addEventListener(
            "mdt:anatomy:selected",
            this.selectionHandler
        );


        /*
         * Selection cleared.
         */

        this.clearHandler =
            () => {

                this.close();

            };

        window.addEventListener(
            "mdt:anatomy:cleared",
            this.clearHandler
        );


        /*
         * Close button.
         */

        this.element.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-clinical-close]"
                    );

                if (!button) {

                    return;

                }

                this.close();

            }
        );

    }


    /* ======================================================
     * Open
     * ====================================================== */

    open(detail = {}) {

        this.entity =
            detail.entity ||
            null;

        this.opened =
            true;

        this.renderClinicalContent();

        this.show();

    }


    /* ======================================================
     * Close
     * ====================================================== */

    close() {

        this.opened =
            false;

        this.entity =
            null;

        this.hide();

    }


    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        if (!this.element) {

            return;

        }

        if (!this.opened) {

            this.element.innerHTML =
                "";

            return;

        }

        this.renderClinicalContent();

    }


    /* ======================================================
     * Clinical Content
     * ====================================================== */

    renderClinicalContent() {

        if (!this.element) {

            return;

        }

        const entity =
            this.entity;

        const name =
            this.getDisplayName(
                entity
            );

        const parent =
            entity?.anatomical_parent_name
            ||
            entity?.parent_name
            ||
            entity?.region
            ||
            "Anatomie";

        const laterality =
            entity?.laterality &&
            entity.laterality !== "none"
                ? entity.laterality
                : "";

        const category =
            entity?.category ||
            "Structure anatomique";

        const status =
            this.getClinicalStatus(
                entity
            );

        this.element.innerHTML = `

            <div class="clinical-card-inner">

                <header class="clinical-card-header">

                    <div class="clinical-card-heading">

                        <div class="clinical-card-icon">

                            ${this.getIcon(entity)}

                        </div>

                        <div>

                            <div class="clinical-card-eyebrow">

                                ${this.escapeHTML(category)}

                            </div>

                            <h2 class="clinical-card-title">

                                ${this.escapeHTML(name)}

                            </h2>

                            <div class="clinical-card-subtitle">

                                ${this.escapeHTML(
                                    [
                                        parent,
                                        laterality
                                    ]
                                    .filter(Boolean)
                                    .join(" · ")
                                )}

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        class="clinical-card-close"
                        data-clinical-close
                        aria-label="Fermer"
                    >
                        ×
                    </button>

                </header>


                <div class="clinical-card-content">

                    ${this.renderStatus(status)}

                    ${this.renderAlerts(entity)}

                    ${this.renderImaging(entity)}

                    ${this.renderLaboratory(entity)}

                    ${this.renderMeasurements(entity)}

                    ${this.renderHistory(entity)}

                </div>

            </div>

        `;

    }


    /* ======================================================
     * Status
     * ====================================================== */

    getClinicalStatus(entity) {

        const status =
            entity?.clinical?.status
            ??
            entity?.status
            ??
            null;

        if (!status) {

            return {

                available: false,

                label:
                    "Aucune donnée clinique disponible"

            };

        }

        return {

            available: true,

            label:
                typeof status === "string"
                    ? status
                    : status.label
                        || status.name
                        || "État clinique disponible",

            value:
                typeof status === "object"
                    ? status.value
                    : null,

            severity:
                typeof status === "object"
                    ? status.severity
                    : null

        };

    }


    renderStatus(status) {

        if (!status?.available) {

            return `

                <section class="clinical-section clinical-status-empty">

                    <div class="clinical-section-header">

                        <span class="clinical-section-icon">
                            ●
                        </span>

                        <span>
                            État clinique
                        </span>

                    </div>

                    <div class="clinical-empty">

                        ${this.escapeHTML(
                            status?.label ||
                            "Aucune donnée clinique disponible"
                        )}

                    </div>

                </section>

            `;

        }

        return `

            <section class="clinical-section clinical-status">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ●
                    </span>

                    <span>
                        État clinique
                    </span>

                </div>

                <div class="clinical-status-value">

                    ${this.escapeHTML(
                        status.label
                    )}

                    ${
                        status.value !== null
                            ? `
                                <strong>
                                    ${this.escapeHTML(
                                        status.value
                                    )}
                                </strong>
                            `
                            : ""
                    }

                </div>

            </section>

        `;

    }


    /* ======================================================
     * Alerts
     * ====================================================== */

    renderAlerts(entity) {

        const alerts =
            entity?.clinical?.alerts
            ||
            entity?.alerts
            ||
            [];

        if (
            !Array.isArray(alerts) ||
            alerts.length === 0
        ) {

            return "";

        }

        return `

            <section class="clinical-section">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        !
                    </span>

                    <span>
                        Alertes
                    </span>

                    <span class="clinical-section-count">
                        ${alerts.length}
                    </span>

                </div>

                <div class="clinical-alert-list">

                    ${alerts.map(
                        alert =>
                            this.renderAlert(
                                alert
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    renderAlert(alert) {

        const label =
            typeof alert === "string"
                ? alert
                : alert?.label
                    || alert?.title
                    || "Alerte clinique";

        const severity =
            typeof alert === "object"
                ? alert?.severity
                : null;

        return `

            <div class="
                clinical-alert
                clinical-alert-${this.escapeHTML(
                    severity || "info"
                )}
            ">

                <span class="clinical-alert-dot"></span>

                <span>
                    ${this.escapeHTML(label)}
                </span>

            </div>

        `;

    }


    /* ======================================================
     * Imaging
     * ====================================================== */

    renderImaging(entity) {

        const imaging =
            entity?.clinical?.imaging
            ||
            entity?.imaging
            ||
            [];

        if (
            !Array.isArray(imaging) ||
            imaging.length === 0
        ) {

            return this.renderEmptySection(
                "Imagerie",
                "Aucune imagerie associée"
            );

        }

        return `

            <section class="clinical-section">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ◫
                    </span>

                    <span>
                        Imagerie
                    </span>

                </div>

                <div class="clinical-data-grid">

                    ${imaging.map(
                        item =>
                            this.renderDataItem(
                                item
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    /* ======================================================
     * Laboratory
     * ====================================================== */

    renderLaboratory(entity) {

        const laboratory =
            entity?.clinical?.laboratory
            ||
            entity?.laboratory
            ||
            entity?.analyses
            ||
            [];

        if (
            !Array.isArray(laboratory) ||
            laboratory.length === 0
        ) {

            return this.renderEmptySection(
                "Biologie",
                "Aucune analyse associée"
            );

        }

        return `

            <section class="clinical-section">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ◌
                    </span>

                    <span>
                        Biologie
                    </span>

                </div>

                <div class="clinical-data-grid">

                    ${laboratory.map(
                        item =>
                            this.renderDataItem(
                                item
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    /* ======================================================
     * Measurements
     * ====================================================== */

    renderMeasurements(entity) {

        const measurements =
            entity?.clinical?.measurements
            ||
            entity?.measurements
            ||
            [];

        if (
            !Array.isArray(measurements) ||
            measurements.length === 0
        ) {

            return "";

        }

        return `

            <section class="clinical-section">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ≈
                    </span>

                    <span>
                        Mesures
                    </span>

                </div>

                <div class="clinical-measurements">

                    ${measurements.map(
                        item =>
                            this.renderMeasurement(
                                item
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    renderMeasurement(item) {

        const label =
            typeof item === "string"
                ? item
                : item?.label
                    || item?.name
                    || "Mesure";

        const value =
            typeof item === "object"
                ? item?.value
                : null;

        const unit =
            typeof item === "object"
                ? item?.unit
                : "";

        return `

            <div class="clinical-measurement">

                <span class="clinical-measurement-label">

                    ${this.escapeHTML(label)}

                </span>

                <span class="clinical-measurement-value">

                    ${
                        value !== null &&
                        value !== undefined
                            ? this.escapeHTML(value)
                            : "—"
                    }

                    ${
                        unit
                            ? `
                                <small>
                                    ${this.escapeHTML(unit)}
                                </small>
                            `
                            : ""
                    }

                </span>

            </div>

        `;

    }


    /* ======================================================
     * History
     * ====================================================== */

    renderHistory(entity) {

        const history =
            entity?.clinical?.history
            ||
            entity?.history
            ||
            [];

        if (
            !Array.isArray(history) ||
            history.length === 0
        ) {

            return "";

        }

        return `

            <section class="clinical-section">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ↗
                    </span>

                    <span>
                        Historique
                    </span>

                </div>

                <div class="clinical-history">

                    ${history.map(
                        item =>
                            this.renderHistoryItem(
                                item
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    renderHistoryItem(item) {

        const date =
            typeof item === "object"
                ? item?.date
                : null;

        const label =
            typeof item === "string"
                ? item
                : item?.label
                    || item?.name
                    || "Événement";

        const value =
            typeof item === "object"
                ? item?.value
                : null;

        return `

            <div class="clinical-history-item">

                <div class="clinical-history-marker"></div>

                <div class="clinical-history-content">

                    ${
                        date
                            ? `
                                <div class="clinical-history-date">
                                    ${this.escapeHTML(date)}
                                </div>
                            `
                            : ""
                    }

                    <div class="clinical-history-label">

                        ${this.escapeHTML(label)}

                    </div>

                    ${
                        value !== null &&
                        value !== undefined
                            ? `
                                <div class="clinical-history-value">
                                    ${this.escapeHTML(value)}
                                </div>
                            `
                            : ""
                    }

                </div>

            </div>

        `;

    }


    /* ======================================================
     * Empty Section
     * ====================================================== */

    renderEmptySection(
        title,
        message
    ) {

        return `

            <section class="
                clinical-section
                clinical-section-muted
            ">

                <div class="clinical-section-header">

                    <span class="clinical-section-icon">
                        ·
                    </span>

                    <span>
                        ${this.escapeHTML(title)}
                    </span>

                </div>

                <div class="clinical-empty">

                    ${this.escapeHTML(message)}

                </div>

            </section>

        `;

    }


    /* ======================================================
     * Generic Data Item
     * ====================================================== */

    renderDataItem(item) {

        const label =
            typeof item === "string"
                ? item
                : item?.label
                    || item?.name
                    || "Donnée";

        const value =
            typeof item === "object"
                ? item?.value
                : null;

        const date =
            typeof item === "object"
                ? item?.date
                : null;

        return `

            <div class="clinical-data-item">

                <div class="clinical-data-label">

                    ${this.escapeHTML(label)}

                </div>

                ${
                    value !== null &&
                    value !== undefined
                        ? `
                            <div class="clinical-data-value">
                                ${this.escapeHTML(value)}
                            </div>
                        `
                        : ""
                }

                ${
                    date
                        ? `
                            <div class="clinical-data-date">
                                ${this.escapeHTML(date)}
                            </div>
                        `
                        : ""
                }

            </div>

        `;

    }


    /* ======================================================
     * Icon
     * ====================================================== */

    getIcon(entity) {

        const category =
            String(
                entity?.category ||
                ""
            ).toLowerCase();

        if (
            category.includes("lung") ||
            category.includes("poumon")
        ) {

            return "◉";

        }

        if (
            category.includes("heart") ||
            category.includes("coeur")
        ) {

            return "♡";

        }

        if (
            category.includes("brain") ||
            category.includes("cerveau")
        ) {

            return "◈";

        }

        return "◉";

    }


    /* ======================================================
     * Display Name
     * ====================================================== */

    getDisplayName(entity) {

        return (
            entity?.canonical_name
            ||
            entity?.display_name
            ||
            entity?.name
            ||
            "Structure anatomique"
        );

    }


    /* ======================================================
     * Visibility
     * ====================================================== */

    show() {

        if (!this.element) {

            return;

        }

        this.element.hidden =
            false;

        this.element.classList.add(
            "is-open"
        );

    }


    hide() {

        if (!this.element) {

            return;

        }

        this.element.classList.remove(
            "is-open"
        );

        this.element.hidden =
            true;

    }


    /* ======================================================
     * HTML Safety
     * ====================================================== */

    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        if (
            this.selectionHandler
        ) {

            window.removeEventListener(
                "mdt:anatomy:selected",
                this.selectionHandler
            );

        }

        if (
            this.clearHandler
        ) {

            window.removeEventListener(
                "mdt:anatomy:cleared",
                this.clearHandler
            );

        }

        this.element?.remove();

        this.element =
            null;

        this.entity =
            null;

        this.selectionHandler =
            null;

        this.clearHandler =
            null;

        this.opened =
            false;

    }

}
