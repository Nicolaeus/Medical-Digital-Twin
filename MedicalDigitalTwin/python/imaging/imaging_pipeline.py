from pathlib import Path

from dicom.dicom_importer import (
    DicomImporter
)

from dicom.dicom_to_nifti import (
    DicomToNiftiConverter
)

from segmentation.run_segmentation import (
    run_totalsegmentator
)

from radiomics.export_mdt_features import (
    MdtFeatureExporter
)


class ImagingPipeline:

    def execute(
        self,
        dicom_folder: str,
        working_folder: str
    ):

        working = Path(
            working_folder
        )

        nifti_folder = (
            working / "nifti"
        )

        segmentation_folder = (
            working / "segmentation"
        )

        features_folder = (
            working / "features"
        )

        nifti_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        segmentation_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        features_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        print(
            "STEP 1 - Reading DICOM"
        )

        importer = DicomImporter()

        study = importer.scan_study(
            dicom_folder
        )

        if not study:
            raise Exception(
                "No DICOM found."
            )

        study_uid = study[0][
            "study_uid"
        ]

        print(
            f"Study UID: {study_uid}"
        )

        print(
            "STEP 2 - DICOM -> NIfTI"
        )

        converter = (
            DicomToNiftiConverter()
        )

        nifti_file = converter.convert(
            dicom_folder,
            str(nifti_folder)
        )

        print(
            f"NIfTI: {nifti_file}"
        )

        print(
            "STEP 3 - Segmentation"
        )

        run_totalsegmentator(
            nifti_file,
            str(segmentation_folder)
        )

        print(
            "STEP 4 - Feature Extraction"
        )

        exporter = (
            MdtFeatureExporter()
        )

        output_json = (
            features_folder
            / "features.json"
        )

        exporter.export(
            str(segmentation_folder),
            str(output_json),
            study_uid
        )

        print(
            f"Features exported: "
            f"{output_json}"
        )


if __name__ == "__main__":

    pipeline = ImagingPipeline()

    pipeline.execute(
        "../../data/dicom",
        "../../data/imaging"
    )