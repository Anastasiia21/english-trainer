import json
from pathlib import Path

NEW_WORDS_PATH = Path("new_words.txt")
WORDS_PATH = Path("public/words.json")
SEPARATORS = [" - ", " — ", ":", "\t", "-"]


def parse_line(line):
    stripped = line.strip()
    if not stripped or stripped.startswith("#"):
        return None

    for separator in SEPARATORS:
        if separator in stripped:
            ru, en = [part.strip() for part in stripped.split(separator, 1)]
            if ru and en:
                return {"ru": ru, "en": en}
            break

    raise ValueError(f"Cannot parse line: {line!r}. Use format: русский - english")


def load_words():
    if not WORDS_PATH.exists():
        WORDS_PATH.parent.mkdir(parents=True, exist_ok=True)
        return []
    return json.loads(WORDS_PATH.read_text(encoding="utf8"))


def import_new_words():
    if not NEW_WORDS_PATH.exists():
        return []

    words = load_words()
    existing = {(item.get("ru", "").strip().lower(), item.get("en", "").strip().lower()) for item in words}
    remaining = []
    imported = []

    for line in NEW_WORDS_PATH.read_text(encoding="utf8").splitlines():
        parsed = parse_line(line)
        if parsed is None:
            remaining.append(line)
            continue

        key = (parsed["ru"].lower(), parsed["en"].lower())
        if key in existing:
            continue

        words.append(parsed)
        existing.add(key)
        imported.append(parsed)

    if imported:
        WORDS_PATH.write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n", encoding="utf8")

    NEW_WORDS_PATH.write_text("\n".join(remaining) + ("\n" if remaining else ""), encoding="utf8")
    return imported


if __name__ == "__main__":
    added = import_new_words()
    if added:
        print("Imported: " + ", ".join(item["ru"] for item in added))
    else:
        print("No new words imported")
