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

        this.clear();

        this.selected = entityId;

        this.selectedEntity = entity;

        this.model?.highlightEntity(

            entityId

        );

        Store.set(

            "body.selected",

            entityId

        );

        Store.set(

            "body.selectedEntity",

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

        this.clear();

        this.selected = name;

        this.model?.highlight(name);

        Store.set(

            "body.selected",

            name

        );

    }

    /* ======================================================
     * Clear
     * ====================================================== */

    clear() {

        this.model?.clearSelection();

        this.selected = null;

        this.selectedEntity = null;

        Store.set(

            "body.selected",

            null

        );

        Store.set(

            "body.selectedEntity",

            null

        );

    }

    /* ======================================================
     * Focus
     * ====================================================== */

    focus(name = this.selected) {

        if (!name) {

            return;

        }

        const entity =

            this.model?.getEntity(name);

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

            this.model?.getOrgan(name);

        if (!organ) {

            return;

        }

        this.camera?.focus(

            organ.getAbsolutePosition()

        );

    }

    /* ======================================================
     * Helpers
     * ====================================================== */

    hasSelection() {

        return this.selected !== null;

    }

    isSelected(name) {

        return this.selected === name;

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

        this.selectEntity(name);

    }

}