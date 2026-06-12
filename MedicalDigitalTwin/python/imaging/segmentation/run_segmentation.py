import sys
import subprocess
from pathlib import Path


def run_totalsegmentator(
    input_nifti: str,
    output_folder: str
) -> None:

    input_path = Path(input_nifti)

    if not input_path.exists():
        raise FileNotFoundError(
            f"NIfTI file not found: {input_nifti}"
        )

    output_path = Path(output_folder)

    output_path.mkdir(
        parents=True,
        exist_ok=True
    )

    command = [
        "TotalSegmentator",
        "-i",
        str(input_path),
        "-o",
        str(output_path)
    ]

    print(
        "Running TotalSegmentator..."
    )

    print(
        " ".join(command)
    )

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:

        print(result.stderr)

        raise RuntimeError(
            "TotalSegmentator execution failed."
        )

    print(
        "Segmentation completed."
    )


def main():

    if len(sys.argv) != 3:

        print(
            "Usage:"
        )

        print(
            "python run_segmentation.py "
            "<input_nifti> "
            "<output_folder>"
        )

        sys.exit(1)

    input_nifti = sys.argv[1]

    output_folder = sys.argv[2]

    run_totalsegmentator(
        input_nifti,
        output_folder
    )


if __name__ == "__main__":
    main()