/**
 * ==========================================================
 * Medical Digital Twin
 * FHIRService.js
 * FHIR R4 REST Client
 * ==========================================================
 */

class FHIRService {

    constructor() {

        this.baseUrl = "";

        this.accessToken = null;

        this.initialized = false;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init(config = {}) {

        this.baseUrl = config.baseUrl || "";

        this.accessToken = config.accessToken || null;

        this.initialized = true;

    }

    /* ======================================================
     * Headers
     * ====================================================== */

    headers() {

        const headers = {

            "Accept": "application/fhir+json",

            "Content-Type": "application/fhir+json"

        };

        if (this.accessToken) {

            headers.Authorization =

                `Bearer ${this.accessToken}`;

        }

        return headers;

    }

    /* ======================================================
     * Generic Request
     * ====================================================== */

    async request(path, options = {}) {

        const response = await fetch(

            `${this.baseUrl}/${path}`,

            {

                headers: this.headers(),

                ...options

            }

        );

        if (!response.ok) {

            throw new Error(

                `FHIR ${response.status}`

            );

        }

        return response.json();

    }

    /* ======================================================
     * Search
     * ====================================================== */

    async search(resource, query = "") {

        return this.request(

            `${resource}?${query}`

        );

    }

    /* ======================================================
     * Read
     * ====================================================== */

    async read(resource, id) {

        return this.request(

            `${resource}/${id}`

        );

    }

    /* ======================================================
     * Create
     * ====================================================== */

    async create(resource, body) {

        return this.request(

            resource,

            {

                method: "POST",

                body: JSON.stringify(body)

            }

        );

    }

    /* ======================================================
     * Update
     * ====================================================== */

    async update(resource, id, body) {

        return this.request(

            `${resource}/${id}`,

            {

                method: "PUT",

                body: JSON.stringify(body)

            }

        );

    }

    /* ======================================================
     * Delete
     * ====================================================== */

    async delete(resource, id) {

        return this.request(

            `${resource}/${id}`,

            {

                method: "DELETE"

            }

        );

    }

    /* ======================================================
     * Patient
     * ====================================================== */

    async getPatient(id) {

        return this.read("Patient", id);

    }

    /* ======================================================
     * Observations
     * ====================================================== */

    async getObservations(patientId) {

        return this.search(

            "Observation",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Conditions
     * ====================================================== */

    async getConditions(patientId) {

        return this.search(

            "Condition",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Medications
     * ====================================================== */

    async getMedications(patientId) {

        return this.search(

            "MedicationRequest",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Procedures
     * ====================================================== */

    async getProcedures(patientId) {

        return this.search(

            "Procedure",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Imaging
     * ====================================================== */

    async getImagingStudies(patientId) {

        return this.search(

            "ImagingStudy",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Diagnostic Reports
     * ====================================================== */

    async getDiagnosticReports(patientId) {

        return this.search(

            "DiagnosticReport",

            `patient=${patientId}`

        );

    }

    /* ======================================================
     * Documents
     * ====================================================== */

    async getDocumentReferences(patientId) {

        return this.search(

            "DocumentReference",

            `patient=${patientId}`

        );

    }

}

export default new FHIRService();
