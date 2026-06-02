import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class ImportNewWordsTest(unittest.TestCase):
    def run_import(self, tmp_path):
        script = Path(__file__).resolve().parents[1] / "import_new_words.py"
        return subprocess.run(
            [sys.executable, str(script)],
            cwd=tmp_path,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_imports_new_words_and_removes_imported_lines(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            public = tmp_path / "public"
            public.mkdir()
            (public / "words.json").write_text(
                json.dumps([{"ru": "дом", "en": "house"}], ensure_ascii=False, indent=2),
                encoding="utf8",
            )
            (tmp_path / "new_words.txt").write_text(
                "# comment stays\n\nкошка - cat\nсобака: dog\nдом - house\n",
                encoding="utf8",
            )

            result = self.run_import(tmp_path)

            self.assertEqual(result.returncode, 0, result.stderr)
            words = json.loads((public / "words.json").read_text(encoding="utf8"))
            self.assertEqual(
                words,
                [
                    {"ru": "дом", "en": "house"},
                    {"ru": "кошка", "en": "cat"},
                    {"ru": "собака", "en": "dog"},
                ],
            )
            self.assertEqual((tmp_path / "new_words.txt").read_text(encoding="utf8"), "# comment stays\n\n")
            self.assertIn("Imported: кошка, собака", result.stdout)

    def test_does_nothing_when_no_new_words_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            public = tmp_path / "public"
            public.mkdir()
            (public / "words.json").write_text("[]", encoding="utf8")

            result = self.run_import(tmp_path)

            self.assertEqual(result.returncode, 0)
            self.assertEqual(json.loads((public / "words.json").read_text(encoding="utf8")), [])
            self.assertIn("No new words imported", result.stdout)


if __name__ == "__main__":
    unittest.main()
