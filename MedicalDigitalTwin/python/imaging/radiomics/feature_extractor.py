from pathlib import Path
import json

import nibabel as nib
import numpy as np


class FeatureExtractor:

    def compute_volume_ml(
        self,
        nifti_file: str
    ):

        img = nib.load(nifti_file)

        data = img.get_fdata()

        voxel_volume = (
            img.header.get_zooms()[0]
            * img.header.get_zooms()[1]
            * img.header.get_zooms()[2]
        )

        voxel_count = np.count_nonzero(
            data
        )

        volume_mm3 = (
            voxel_count
            * voxel_volume
        )

        return round(
            volume_mm3 / 1000.0,
            2
        )

    def extract_folder(
        self,
        segmentation_folder: str
    ):

        results = {}

        for file in Path(
            segmentation_folder
        ).glob("*.nii.gz"):

            organ_name = (
                file.name
                .replace(".nii.gz", "")
            )

            volume = self.compute_volume_ml(
                str(file)
            )

            results[organ_name] = {
                "volume_ml": volume
            }

        return results

    def export_json(
        self,
        features: dict,
        output_file: str
    ):
        with open(
            output_file,
            "w",
            encoding="utf8"
        ) as fp:

            json.dump(
                features,
                fp,
                indent=4
            )