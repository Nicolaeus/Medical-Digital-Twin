import subprocess
from pathlib import Path


class SegmentationRunner:

    def run(
        self,
        input_nifti: str,
        output_folder: str
    ):

        Path(output_folder).mkdir(
            parents=True,
            exist_ok=True
        )

        cmd = [
            "TotalSegmentator",
            "-i",
            input_nifti,
            "-o",
            output_folder
        ]

        subprocess.run(
            cmd,
            check=True
        )

        return output_folder