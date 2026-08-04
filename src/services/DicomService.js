/**
 * ==========================================================
 * Medical Digital Twin
 * DicomService.js
 * DICOM / PACS Service
 * ==========================================================
 */

class DicomService {

    constructor() {

        this.provider = null;

        this.connected = false;

        this.endpoint = "";

        this.token = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(config = {}) {

        this.endpoint = config.endpoint || "";

        this.token = config.token || null;

    }

    /* ======================================================
     * Connection
     * ====================================================== */

    async connect() {

        this.connected = true;

    }

    async disconnect() {

        this.connected = false;

    }

    isConnected() {

        return this.connected;

    }

    /* ======================================================
     * Generic Request
     * ====================================================== */

    async request(path, options = {}) {

        const response = await fetch(

            `${this.endpoint}/${path}`,

            {

                headers: {

                    Authorization:

                        this.token ?

                        `Bearer ${this.token}` :

                        ""

                },

                ...options

            }

        );

        if (!response.ok) {

            throw new Error(

                `DICOM ${response.status}`

            );

        }

        return response.json();

    }

    /* ======================================================
     * Patients
     * ====================================================== */

    async searchPatients(query = "") {

        return this.request(

            `patients?${query}`

        );

    }

    async getPatient(id) {

        return this.request(

            `patients/${id}`

        );

    }

    /* ======================================================
     * Studies
     * ====================================================== */

    async searchStudies(query = "") {

        return this.request(

            `studies?${query}`

        );

    }

    async getStudy(uid) {

        return this.request(

            `studies/${uid}`

        );

    }

    /* ======================================================
     * Series
     * ====================================================== */

    async searchSeries(studyUID) {

        return this.request(

            `studies/${studyUID}/series`

        );

    }

    async getSeries(uid) {

        return this.request(

            `series/${uid}`

        );

    }

    /* ======================================================
     * Instances
     * ====================================================== */

    async searchInstances(seriesUID) {

        return this.request(

            `series/${seriesUID}/instances`

        );

    }

    async getInstance(uid) {

        return this.request(

            `instances/${uid}`

        );

    }

    /* ======================================================
     * Metadata
     * ====================================================== */

    async getMetadata(uid) {

        return this.request(

            `instances/${uid}/metadata`

        );

    }

    /* ======================================================
     * Download
     * ====================================================== */

    async download(uid) {

        return this.request(

            `instances/${uid}/file`

        );

    }

    /* ======================================================
     * Upload
     * ====================================================== */

    async upload(file) {

        return this.request(

            "instances",

            {

                method: "POST",

                body: file

            }

        );

    }

    /* ======================================================
     * Import Local Files
     * ====================================================== */

    async importFiles(files = []) {

        console.log(

            "Import",

            files

        );

        return files;

    }

    /* ======================================================
     * Delete
     * ====================================================== */

    async delete(uid) {

        return this.request(

            `instances/${uid}`,

            {

                method: "DELETE"

            }

        );

    }

}

export default new DicomService();
