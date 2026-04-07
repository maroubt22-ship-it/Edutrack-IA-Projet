from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="EduTrack AI API", version="0.1.0")


class AnalyzePayload(BaseModel):
    history: list[float]


class SmartNotePayload(BaseModel):
    raw_note: str


def _trend(history: list[float]) -> dict:
    if len(history) < 2:
        return {"trend": "stable", "delta_percent": 0}

    first = history[0]
    last = history[-1]
    if first == 0:
        return {"trend": "stable", "delta_percent": 0}

    delta = round(((last - first) / first) * 100, 1)
    if delta > 2:
        direction = "up"
    elif delta < -2:
        direction = "down"
    else:
        direction = "stable"

    return {"trend": direction, "delta_percent": delta}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/ai/analyze")
def analyze_progress(payload: AnalyzePayload) -> dict:
    return {"ok": True, "analysis": _trend(payload.history)}


@app.post("/ai/smart-note")
def smart_note(payload: SmartNotePayload) -> dict:
    note = payload.raw_note.strip()
    if not note:
        text = "Aucune observation fournie."
    else:
        text = (
            f"Observation pedagogique: {note}. "
            "L'eleve presente une progression encourageante et un suivi cible est recommande."
        )
    return {"ok": True, "text": text}
