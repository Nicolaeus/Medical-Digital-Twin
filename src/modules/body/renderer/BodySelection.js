/**
 * ==========================================================
 * Medical Digital Twin
 * BodySelection.js
 * Anatomical Entity Selection Manager
 * ==========================================================
 */

import Store from "../../../core/store.js";

export default class BodySelection {

    constructor({

        model,

        camera

    } = {}) {

        this.model = model;

        this.camera = camera;

        this.selected = null;

        this.selectedEntity = null;

    }

    /* ======================================================
     * Select Entity
     * ====================================================== */

    selectEntity(entityId) {

        if (!entityId) {

            return;

        }

        const entity =
            this.model?.getEntity(
                entityId
            );

        if (!entity) {

            console.warn(
                "Unknown anatomical entity:",
                entityId
            );

            return;

        }

        /*
         * Clear previous visual selection without
         * emitting a second "selection cleared" event.
         */

        this.clear({
            emit: false
        });

        this.selected =
            entityId;

        this.selectedEntity =
            entity;

        /*
         * Highlight the anatomical entity
         * directly on the 3D model.
         */

        this.model?.highlightEntity(
            entityId
        );

        /*
         * Store
         */

        Store.set(
            "body.selected",
            entityId
        );

        Store.set(
            "body.selectedEntity",
            entity
        );

        /*
         * Notify the rest of the application.
         *
         * The Body Twin does NOT open a card directly.
         * The Card / UI layer decides what to display.
         */

        this.emitSelectionEvent(
            entity
        );

    }

    /* ======================================================
     * Select Mesh
     * ====================================================== */

    selectMesh(mesh) {

        const entity =
            this.model?.getEntityForMesh(
                mesh
            );

        if (!entity) {

            return;

        }

        this.selectEntity(
            entity.id
        );

    }

    /* ======================================================
     * Legacy Select
     * ====================================================== */

    select(name) {

        const entity =
            this.model?.getEntityForMesh(
                name
            );

        if (entity) {

            this.selectEntity(
                entity.id
            );

            return;

        }

        if (!name) {

            return;

        }

        this.clear({
            emit: false
        });

        this.selected =
            name;

        this.model?.highlight(
            name
        );

        Store.set(
            "body.selected",
            name
        );

        /*
         * Legacy mesh selection does not necessarily
         * have a complete anatomical entity.
         *
         * Still expose the selection to the UI.
         */

        this.emitSelectionEvent(
            null,
            {
                selected: name
            }
        );

    }

    /* ======================================================
     * Clear
     * ====================================================== */

    clear({

        emit = true

    } = {}) {

        const previousEntity =
            this.selectedEntity;

        const previousId =
            this.selected;

        this.model?.clearSelection();

        this.selected =
            null;

        this.selectedEntity =
            null;

        Store.set(
            "body.selected",
            null
        );

        Store.set(
            "body.selectedEntity",
            null
        );

        /*
         * Tell the UI that the anatomical selection
         * has been cleared.
         */

        if (
            emit &&
            (
                previousId !== null ||
                previousEntity !== null
            )
        ) {

            this.emitClearEvent(
                previousId,
                previousEntity
            );

        }

    }

    /* ======================================================
     * Focus
     * ====================================================== */

    focus(
        name = this.selected
    ) {

        if (!name) {

            return;

        }

        const entity =
            this.model?.getEntity(
                name
            );

        if (entity) {

            const objects =
                entity.objects || [];

            const first =
                objects[0];

            if (first) {

                const mesh =
                    this.model.getOrgan(
                        first.object_name
                    );

                if (mesh) {

                    this.camera?.focus(
                        mesh.getAbsolutePosition()
                    );

                }

            }

            return;

        }

        const organ =
            this.model?.getOrgan(
                name
            );

        if (!organ) {

            return;

        }

        this.camera?.focus(
            organ.getAbsolutePosition()
        );

    }

    /* ======================================================
     * Selection Event
     * ====================================================== */

    emitSelectionEvent(
        entity,
        extra = {}
    ) {

        if (
            typeof window ===
            "undefined"
        ) {

            return;

        }

        const detail = {

            /*
             * Main identifier.
             */

            entityId:
                entity?.id ||
                this.selected ||
                null,

            /*
             * Display name.
             */

            name:
                entity?.canonical_name ||
                entity?.display_name ||
                entity?.name ||
                null,

            /*
             * Anatomical hierarchy.
             */

            parent:
                entity?.anatomical_parent_name ||
                null,

            /*
             * Laterality.
             */

            laterality:
                entity?.laterality ||
                "none",

            /*
             * Entity category.
             */

            category:
                entity?.category ||
                null,

            /*
             * Complete entity.
             *
             * This lets the card layer access additional
             * information without coupling itself to Babylon.
             */

            entity:
                entity ||
                null,

            /*
             * Source of the interaction.
             */

            source:
                "3d",

            ...extra

        };

        window.dispatchEvent(

            new CustomEvent(
                "mdt:anatomy:selected",
                {
                    detail
                }
            )

        );

    }

    /* ======================================================
     * Clear Event
     * ====================================================== */

    emitClearEvent(
        entityId,
        entity
    ) {

        if (
            typeof window ===
            "undefined"
        ) {

            return;

        }

        window.dispatchEvent(

            new CustomEvent(
                "mdt:anatomy:cleared",
                {

                    detail: {

                        entityId:
                            entityId ||
                            null,

                        entity:
                            entity ||
                            null,

                        source:
                            "3d"

                    }

                }
            )

        );

    }

    /* ======================================================
     * Helpers
     * ====================================================== */

    hasSelection() {

        return (
            this.selected !== null
        );

    }

    isSelected(name) {

        return (
            this.selected === name
        );

    }

    getSelected() {

        return this.selected;

    }

    getSelectedEntity() {

        return this.selectedEntity;

    }

    /* ======================================================
     * Toggle
     * ====================================================== */

    toggle(name) {

        if (
            this.selected === name
        ) {

            this.clear();

            return;

        }

        this.selectEntity(
            name
        );

    }

}
