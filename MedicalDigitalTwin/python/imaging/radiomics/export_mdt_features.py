import json
from pathlib import Path

from imaging.radiomics.feature_extractor import (
    FeatureExtractor
)


FEATURE_MAPPING = {
    "liver": "LiverVolume",
    "heart": "HeartVolume",
    "spleen": "SpleenVolume",
    "kidney_left": "LeftKidneyVolume",
    "kidney_right": "RightKidneyVolume",
    "aorta": "AortaVolume",
    "muscle": "MuscleVolume",
    "subcutaneous_fat": "SubcutaneousFatVolume",
    "visceral_fat": "VisceralFatVolume"
}


class MdtFeatureExporter:

    def export(
        self,
        segmentation_folder: str,
        output_file: str,
        study_uid: str = ""
    ):

        extractor = FeatureExtractor()

        raw_features = extractor.extract_folder(
            segmentation_folder
        )

        result = {
            "study_uid": study_uid,
            "features": []
        }

        for organ_name, values in raw_features.items():

            feature_code = FEATURE_MAPPING.get(
                organ_name
            )

            if feature_code is None:
                continue

            result["features"].append(
                {
                    "code": feature_code,
                    "value": values["volume_ml"],
                    "unit": "mL",
                    "source": "TotalSegmentator",
                    "confidence": 0.95
                }
            )

        with open(
            output_file,
            "w",
            encoding="utf8"
        ) as fp:

            json.dump(
                result,
                fp,
                indent=4
            )

        return result