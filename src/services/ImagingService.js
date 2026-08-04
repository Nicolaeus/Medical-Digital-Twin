/**
 * ==========================================================
 * Medical Digital Twin
 * ImagingService.js
 * Medical Imaging Gateway
 * ==========================================================
 */

import DicomService from "./DicomService.js";

class ImagingService {

    constructor() {

        this.providers = [];

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    async init() {

        await DicomService.init();

        this.providers = [

            DicomService

        ];

    }

    /* ======================================================
     * Providers
     * ====================================================== */

    register(provider) {

        this.providers.push(provider);

    }

    getProviders() {

        return this.providers;

    }

    /* ======================================================
     * Connection
     * ====================================================== */

    async connect() {

        for (const provider of this.providers) {

            if (provider.connect) {

                await provider.connect();

            }

        }

    }

    async disconnect() {

        for (const provider of this.providers) {

            if (provider.disconnect) {

                await provider.disconnect();

            }

        }

    }

    /* ======================================================
     * Patient
     * ====================================================== */

    async getPatient(patientId) {

        return DicomService.searchPatients(

            `PatientID=${patientId}`

        );

    }

    /* ======================================================
     * Studies
     * ====================================================== */

    async getStudies(patientId) {

        return DicomService.searchStudies(

            `PatientID=${patientId}`

        );

    }

    /* ======================================================
     * Study
     * ====================================================== */

    async getStudy(studyUID) {

        return DicomService.getStudy(

            studyUID

        );

    }

    /* ======================================================
     * Series
     * ====================================================== */

    async getSeries(studyUID) {

        return DicomService.searchSeries(

            studyUID

        );

    }

    /* ======================================================
     * Instances
     * ====================================================== */

    async getInstances(seriesUID) {

        return DicomService.searchInstances(

            seriesUID

        );

    }

    /* ======================================================
     * Metadata
     * ====================================================== */

    async getMetadata(instanceUID) {

        return DicomService.getMetadata(

            instanceUID

        );

    }

    /* ======================================================
     * Download
     * ====================================================== */

    async download(instanceUID) {

        return DicomService.download(

            instanceUID

        );

    }

    /* ======================================================
     * Upload
     * ====================================================== */

    async upload(file) {

        return DicomService.upload(

            file

        );

    }

    /* ======================================================
     * Import
     * ====================================================== */

    async import(files) {

        return DicomService.importFiles(

            files

        );

    }

}

export default new ImagingService();
