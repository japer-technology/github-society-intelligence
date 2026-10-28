import tempfile
import unittest
import zipfile
from pathlib import Path

from package_skill import package_skill
from quick_validate import validate_skill


class SkillTests(unittest.TestCase):
    def test_empty_required_fields_are_rejected(self):
        for name, description in [("", "Valid"), ("valid", "   ")]:
            with self.subTest(name=name, description=description), tempfile.TemporaryDirectory() as directory:
                Path(directory, "SKILL.md").write_text(
                    f'---\nname: "{name}"\ndescription: "{description}"\n---\n',
                    encoding="utf-8",
                )
                self.assertFalse(validate_skill(directory)[0])

    def test_mixed_unknown_keys_report_validation_error(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, "SKILL.md").write_text(
                "---\nname: valid\ndescription: Valid\n1: unexpected\nextra: key\n---\n",
                encoding="utf-8",
            )
            valid, message = validate_skill(directory)
            self.assertFalse(valid)
            self.assertIn("Unexpected key", message)

    def test_packaging_inside_skill_does_not_include_itself(self):
        with tempfile.TemporaryDirectory() as directory:
            skill = Path(directory, "example")
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                "---\nname: example\ndescription: Valid example\n---\n",
                encoding="utf-8",
            )
            for _ in range(2):
                archive = package_skill(skill, skill)
                self.assertIsNotNone(archive)
                with zipfile.ZipFile(archive) as package:
                    self.assertEqual(package.namelist(), ["example/SKILL.md"])


if __name__ == "__main__":
    unittest.main()
