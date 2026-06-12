from pathlib import Path
import subprocess


class DicomToNiftiConverter:

    def convert(
        self,
        dicom_folder: str,
        output_folder: str
    ) -> str:

        dicom_folder = str(
            Path(dicom_folder).resolve()
        )

        output_folder = str(
            Path(output_folder).resolve()
        )

        Path(output_folder).mkdir(
            parents=True,
            exist_ok=True
        )

        cmd = [
            "dcm2niix",
            "-z", "y",
            "-o", output_folder,
            dicom_folder
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            raise Exception(
                f"dcm2niix failed:\n{result.stderr}"
            )

        nifti_files = list(
            Path(output_folder).glob("*.nii.gz")
        )

        if not nifti_files:
            raise Exception(
                "No NIfTI file generated."
            )

        return str(nifti_files[0])