from pathlib import Path
import pydicom


class DicomImporter:

    def scan_study(self, dicom_folder: str):

        folder = Path(dicom_folder)

        dicom_files = []

        for file in folder.rglob("*"):

            if not file.is_file():
                continue

            try:
                ds = pydicom.dcmread(
                    str(file),
                    stop_before_pixels=True
                )

                dicom_files.append(
                    {
                        "file": str(file),
                        "patient_id":
                            getattr(ds, "PatientID", ""),

                        "study_uid":
                            getattr(
                                ds,
                                "StudyInstanceUID",
                                ""
                            ),

                        "series_uid":
                            getattr(
                                ds,
                                "SeriesInstanceUID",
                                ""
                            ),

                        "modality":
                            getattr(ds, "Modality", ""),

                        "study_date":
                            getattr(ds, "StudyDate", "")
                    }
                )

            except Exception:
                pass

        return dicom_files


if __name__ == "__main__":

    importer = DicomImporter()

    study = importer.scan_study(
        "../../../data/dicom"
    )

    print(
        f"{len(study)} DICOM files detected"
    )