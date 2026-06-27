"""Repository-root friendly entrypoint for the research pipeline."""

from pathlib import Path
import sys

PROJECT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_DIR))

from adaptive_learning.run_pipeline import main


if __name__ == "__main__":
    main()
