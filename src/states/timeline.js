/**
 * ==========================================================
 * Medical Digital Twin
 * state/timeline.js
 * Timeline State
 * ==========================================================
 */

export default {

    /**
     * ------------------------------------------------------
     * Timeline Events
     * ------------------------------------------------------
     */

    events: [

        /*
        {

            id: null,

            type: "",

            category: "",

            title: "",

            description: "",

            start: null,

            end: null,

            allDay: false,

            severity: "info",

            source: null,

            location: null,

            tags: [],

            payload: {}

        }
        */

    ],

    /**
     * ------------------------------------------------------
     * Timeline Filters
     * ------------------------------------------------------
     */

    filters: {

        category: null,

        source: null,

        severity: null,

        from: null,

        to: null

    },

    /**
     * ------------------------------------------------------
     * Current Cursor
     * ------------------------------------------------------
     */

    cursor: {

        selectedDate: null,

        selectedEvent: null

    },

    /**
     * ------------------------------------------------------
     * Metadata
     * ------------------------------------------------------
     */

    lastUpdate: null

};
