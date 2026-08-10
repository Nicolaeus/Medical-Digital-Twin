/**
 * ==========================================================
 * Medical Digital Twin
 * AnatomicalCard.js
 * Anatomical Entity Information Card
 * ==========================================================
 */

import Card from "../../../components/base/Card.js";
import Store from "../../../core/store.js";

export default class AnatomicalCard extends Card {

    constructor(options = {}) {

        super({

            id:
                options.id ??
                "anatomical-card",

            icon:
                options.icon ??
                "🫀",

            title:
                options.title ??
                "Structure anatomique",

            subtitle:
                options.subtitle ??
                ""

        });

        this.entity = null;

        this.imaging = [];

        this.analyses = [];

        this.alerts = [];

        this.storeWatcher = null;

    }

    /* ======================================================
     * Render
     * ====================================================== */

    async render() {

        await super.render();

        /*
         * Card is hidden until an anatomical entity
         * is selected.
         */

        this.hide();

    }

    /* ======================================================
     * Store
     * ====================================================== */

    watchStore() {

        this.storeWatcher =
            Store.watch(
                "body.selectedEntity",
                entity => {

                    if (!entity) {

                        this.clearEntity();

                        return;

                    }

                    this.openEntity(
                        entity
                    );

                }
            );

        this.addWatcher(
            this.storeWatcher
        );

    }

    /* ======================================================
     * Open Entity
     * ====================================================== */

    openEntity(entity) {

        this.entity =
            entity;

        this.imaging =
            entity.imaging ||
            [];

        this.analyses =
            entity.analyses ||
            [];

        this.alerts =
            entity.alerts ||
            [];

        this.updateHeader();

        this.renderEntity();

        this.show();

    }

    /* ======================================================
     * Clear Entity
     * ====================================================== */

    clearEntity() {

        this.entity = null;

        this.imaging = [];

        this.analyses = [];

        this.alerts = [];

        this.hide();

    }

    /* ======================================================
     * Header
     * ====================================================== */

    updateHeader() {

        const name =
            this.getEntityName();

        let subtitle =
            this.entity?.anatomical_parent_name ||
            "Anatomie";

        const laterality =
            this.entity?.laterality;

        if (
            laterality &&
            laterality !== "none"
        ) {

            subtitle +=
                ` · ${this.formatLaterality(
                    laterality
                )}`;

        }

        this.setIcon(
            this.getEntityIcon()
        );

        this.setTitle(
            name
        );

        this.setSubtitle(
            subtitle
        );

    }

    /* ======================================================
     * Entity Body
     * ====================================================== */

    renderEntity() {

        this.setBody(`

            <div class="anatomical-card">

                ${this.renderAlertSection()}

                ${this.renderOverviewSection()}

                ${this.renderImagingSection()}

                ${this.renderAnalysisSection()}

            </div>

        `);

    }

    /* ======================================================
     * Overview
     * ====================================================== */

    renderOverviewSection() {

        const category =
            this.entity?.category ||
            "Structure anatomique";

        const normalized =
            this.entity?.normalized_name ||
            "";

        return `

            <section class="anatomical-section">

                <div class="anatomical-section-title">

                    Anatomie

                </div>

                <div class="anatomical-info">

                    <div class="anatomical-info-row">

                        <span>Catégorie</span>

                        <strong>
                            ${this.escapeHTML(
                                category
                            )}
                        </strong>

                    </div>

                    ${
                        normalized
                            ?
                            `
                            <div class="anatomical-info-row">

                                <span>Référence</span>

                                <strong>
                                    ${this.escapeHTML(
                                        normalized
                                    )}
                                </strong>

                            </div>
                            `
                            :
                            ""
                    }

                </div>

            </section>

        `;

    }

    /* ======================================================
     * Alerts
     * ====================================================== */

    renderAlertSection() {

        if (!this.alerts.length) {

            return "";

        }

        return `

            <section class="anatomical-section anatomical-alerts">

                <div class="anatomical-section-title">

                    Alertes

                </div>

                ${

                    this.alerts
                        .map(
                            alert => `

                                <div class="anatomical-alert">

                                    <div class="anatomical-alert-icon">

                                        ${alert.icon || "⚠️"}

                                    </div>

                                    <div>

                                        <strong>
                                            ${this.escapeHTML(
                                                alert.title ||
                                                "Alerte"
                                            )}
                                        </strong>

                                        <div>
                                            ${this.escapeHTML(
                                                alert.message ||
                                                ""
                                            )}
                                        </div>

                                    </div>

                                </div>

                            `
                        )
                        .join("")

                }

            </section>

        `;

    }

    /* ======================================================
     * Imaging
     * ====================================================== */

    renderImagingSection() {

        return `

            <section class="anatomical-section">

                <div class="anatomical-section-title">

                    Imagerie

                </div>

                ${
                    this.imaging.length
                        ?
                        this.imaging
                            .map(
                                item => `

                                    <div class="anatomical-data-row">

                                        <div>

                                            <strong>
                                                ${this.escapeHTML(
                                                    item.modality ||
                                                    "Imagerie"
                                                )}
                                            </strong>

                                            <div class="anatomical-data-secondary">

                                                ${this.escapeHTML(
                                                    item.date ||
                                                    ""
                                                )}

                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            class="anatomical-action"
                                            data-action="imaging"
                                            data-id="${this.escapeAttribute(
                                                item.id ||
                                                ""
                                            )}"
                                        >
                                            Voir
                                        </button>

                                    </div>

                                `
                            )
                            .join("")

                        :

                        `
                            <div class="anatomical-empty">

                                Aucune imagerie disponible.

                            </div>
                        `
                }

            </section>

        `;

    }

    /* ======================================================
     * Analyses
     * ====================================================== */

    renderAnalysisSection() {

        return `

            <section class="anatomical-section">

                <div class="anatomical-section-title">

                    Analyses

                </div>

                ${
                    this.analyses.length
                        ?
                        this.analyses
                            .map(
                                item => `

                                    <div class="anatomical-analysis">

                                        <div class="anatomical-analysis-header">

                                            <strong>
                                                ${this.escapeHTML(
                                                    item.name ||
                                                    "Analyse"
                                                )}
                                            </strong>

                                            <span>

                                                ${
                                                    item.value ??
                                                    "—"
                                                }

                                                ${
                                                    item.unit
                                                        ?
                                                        ` ${this.escapeHTML(
                                                            item.unit
                                                        )}`
                                                        :
                                                        ""
                                                }

                                            </span>

                                        </div>

                                        <div class="anatomical-chart">

                                            ${this.renderMiniChart(
                                                item.history ||
                                                []
                                            )}

                                        </div>

                                    </div>

                                `
                            )
                            .join("")

                        :

                        `
                            <div class="anatomical-empty">

                                Aucune analyse disponible.

                            </div>
                        `
                }

            </section>

        `;

    }

    /* ======================================================
     * Mini Chart
     * ====================================================== */

    renderMiniChart(history) {

        if (
            !history ||
            history.length < 2
        ) {

            return `

                <div class="anatomical-chart-empty">

                    Historique insuffisant

                </div>

            `;

        }

        const values =
            history.map(
                point =>
                    Number(
                        point.value
                    )
            );

        const min =
            Math.min(
                ...values
            );

        const max =
            Math.max(
                ...values
            );

        const range =
            max - min || 1;

        const points =
            values
                .map(
                    (value, index) => {

                        const x =
                            (
                                index /
                                (
                                    values.length -
                                    1
                                )
                            ) * 100;

                        const y =
                            100 -
                            (
                                (
                                    value -
                                    min
                                ) /
                                range
                            ) * 100;

                        return `${x},${y}`;

                    }
                )
                .join(" ");

        return `

            <svg
                class="anatomical-chart-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >

                <polyline
                    points="${points}"
                    fill="none"
                    vector-effect="non-scaling-stroke"
                />

            </svg>

        `;

    }

    /* ======================================================
     * Events
     * ====================================================== */

    bindEvents() {

        if (!this.element) {

            return;

        }

        this.element.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {

                    return;

                }

                this.handleAction(
                    button.dataset.action,
                    button.dataset.id
                );

            }
        );

    }

    /* ======================================================
     * Actions
     * ====================================================== */

    handleAction(
        action,
        id
    ) {

        switch (action) {

            case "imaging":

                window.dispatchEvent(

                    new CustomEvent(
                        "mdt:imaging:open",
                        {

                            detail: {

                                entity:
                                    this.entity,

                                imagingId:
                                    id

                            }

                        }
                    )

                );

                break;

        }

    }

    /* ======================================================
     * Icon
     * ====================================================== */

    getEntityIcon() {

        const category =
            this.entity?.category ||
            "";

        if (
            category
                .toLowerCase()
                .includes("organ")
        ) {

            return "🫀";

        }

        return "🧬";

    }

    /* ======================================================
     * Helpers
     * ====================================================== */

    getEntityName() {

        return (

            this.entity?.display_name ||

            this.entity?.canonical_name ||

            this.entity?.normalized_name ||

            "Anatomie"

        );

    }

    formatLaterality(
        laterality
    ) {

        const labels = {

            left:
                "Gauche",

            right:
                "Droite",

            bilateral:
                "Bilatéral"

        };

        return (

            labels[laterality] ||

            laterality

        );

    }

    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

    escapeAttribute(value) {

        return this.escapeHTML(
            value
        );

    }

}
