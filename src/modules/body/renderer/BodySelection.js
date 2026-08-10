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
         * If the same entity is clicked again,
         * keep the selection and notify the UI.
         *
         * The UI can decide whether this means:
         *
         * - keep the ClinicalCard open
         * - focus the organ
         * - toggle the card
         */

        this.clear({
            emit: false
        });

        this.selected =
            entityId;

        this.selectedEntity =
            entity;

        /*
         * --------------------------------------------------
         * 3D highlight
         * --------------------------------------------------
         */

        this.model?.highlightEntity(
            entityId
        );

        /*
         * --------------------------------------------------
         * Global Store
         * --------------------------------------------------
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
         * --------------------------------------------------
         * UI event
         * --------------------------------------------------
         *
         * BodySelection does NOT create a card.
         *
         * The UI layer listens to this event and decides
         * which clinical interface to display.
         */

        this.emitSelectionEvent(
            entity,
            {
                selectionType:
                    "entity"
            }
        );

    }


    /* ======================================================
     * Select Mesh
     * ====================================================== */

    selectMesh(mesh) {

        if (!mesh) {

            return;

        }

        const entity =
            this.model?.getEntityForMesh(
                mesh
            );

        /*
         * If the mesh belongs to an entity,
         * promote the selection to the entity level.
         */

        if (entity) {

            this.selectEntity(
                entity.id
            );

            return;

        }

        /*
         * Otherwise expose the raw mesh selection.
         *
         * This is useful while the anatomical resolver
         * is still incomplete.
         */

        const meshName =
            mesh?.name;

        if (!meshName) {

            return;

        }

        this.select(
            meshName
        );

    }


    /* ======================================================
     * Legacy / Mesh Select
     * ====================================================== */

    select(name) {

        if (!name) {

            return;

        }

        const entity =
            this.model?.getEntityForMesh(
                name
            );

        /*
         * Prefer the entity whenever possible.
         */

        if (entity) {

            this.selectEntity(
                entity.id
            );

            return;

        }

        /*
         * Raw mesh selection.
         */

        this.clear({
            emit: false
        });

        this.selected =
            name;

        this.selectedEntity =
            null;

        this.model?.highlight(
            name
        );

        Store.set(
            "body.selected",
            name
        );

        Store.set(
            "body.selectedEntity",
            null
        );

        /*
         * The UI can still display a generic
         * anatomical information card.
         */

        this.emitSelectionEvent(
            null,
            {

                selectionType:
                    "mesh",

                selectedMesh:
                    name

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

        /*
         * Remove visual highlight.
         */

        this.model?.clearSelection();

        /*
         * Reset local state.
         */

        this.selected =
            null;

        this.selectedEntity =
            null;

        /*
         * Reset Store.
         */

        Store.set(
            "body.selected",
            null
        );

        Store.set(
            "body.selectedEntity",
            null
        );

        /*
         * Notify UI only when there was
         * actually something selected.
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
     * Focus Selected
     * ====================================================== */

    focus(
        name = this.selected
    ) {

        if (!name) {

            return;

        }

        /*
         * Entity
         */

        const entity =
            this.model?.getEntity(
                name
            );

        if (entity) {

            const objects =
                entity.objects || [];

            /*
             * Try to find the first usable mesh.
             */

            for (
                const object
                of objects
            ) {

                const mesh =
                    this.model.getOrgan(
                        object.object_name
                    );

                if (!mesh) {

                    continue;

                }

                this.camera?.focus(
                    mesh.getAbsolutePosition()
                );

                return;

            }

        }

        /*
         * Raw mesh.
         */

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
             * --------------------------------------------------
             * Identifier
             * --------------------------------------------------
             */

            entityId:
                entity?.id ||
                this.selected ||
                null,

            /*
             * --------------------------------------------------
             * Display name
             * --------------------------------------------------
             */

            name:
                entity?.canonical_name ||
                entity?.display_name ||
                entity?.name ||
                this.selected ||
                null,

            /*
             * --------------------------------------------------
             * Anatomical hierarchy
             * --------------------------------------------------
             */

            parent:
                entity?.anatomical_parent_name ||
                entity?.parent_name ||
                null,

            /*
             * --------------------------------------------------
             * Laterality
             * --------------------------------------------------
             */

            laterality:
                entity?.laterality ||
                "none",

            /*
             * --------------------------------------------------
             * Category
             * --------------------------------------------------
             */

            category:
                entity?.category ||
                null,

            /*
             * --------------------------------------------------
             * Complete entity
             * --------------------------------------------------
             *
             * ClinicalCard can use this without having
             * any Babylon dependency.
             */

            entity:
                entity ||
                null,

            /*
             * --------------------------------------------------
             * Interaction source
             * --------------------------------------------------
             */

            source:
                "3d",

            /*
             * --------------------------------------------------
             * Timestamp
             * --------------------------------------------------
             *
             * Useful later for interaction tracking.
             */

            timestamp:
                Date.now(),

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
                            "3d",

                        timestamp:
                            Date.now()

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

        /*
         * Prefer entity selection.
         */

        const entity =
            this.model?.getEntity(
                name
            );

        if (entity) {

            this.selectEntity(
                name
            );

            return;

        }

        /*
         * Otherwise mesh selection.
         */

        this.select(
            name
        );

    }

}
