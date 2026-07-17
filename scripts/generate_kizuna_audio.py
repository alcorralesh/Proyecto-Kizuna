"""Genera el paquete sonoro original de KIZUNA sin recursos externos."""

from __future__ import annotations

import json
import math
import wave
from pathlib import Path

import numpy as np


RATE = 44_100
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "audio" / "kizuna"
RNG = np.random.default_rng(20260717)


def envelope(length: int, attack: float = 0.01, release: float = 0.18) -> np.ndarray:
    env = np.ones(length, dtype=np.float64)
    a = min(length, max(1, int(RATE * attack)))
    r = min(length, max(1, int(RATE * release)))
    env[:a] = np.linspace(0, 1, a)
    env[-r:] *= np.linspace(1, 0, r)
    return env


def tone(duration: float, frequency: float, volume: float = 0.3, *, end_frequency: float | None = None,
         attack: float = 0.008, release: float = 0.16, harmonics: tuple[tuple[float, float], ...] = ()) -> np.ndarray:
    count = max(1, int(duration * RATE))
    if end_frequency is None:
        phase = 2 * np.pi * frequency * np.arange(count) / RATE
    else:
        frequencies = np.linspace(frequency, end_frequency, count)
        phase = 2 * np.pi * np.cumsum(frequencies) / RATE
    result = np.sin(phase)
    for multiplier, strength in harmonics:
        result += strength * np.sin(phase * multiplier)
    return result * envelope(count, attack, release) * volume


def filtered_noise(duration: float, volume: float = 0.2, smooth: int = 12, *, attack: float = 0.005,
                   release: float = 0.12) -> np.ndarray:
    count = max(1, int(duration * RATE))
    raw = RNG.normal(0, 1, count + smooth)
    kernel = np.ones(smooth) / smooth
    shaped = np.convolve(raw, kernel, mode="valid")[:count]
    peak = np.max(np.abs(shaped)) or 1
    return shaped / peak * envelope(count, attack, release) * volume


def impact(volume: float = 0.45, duration: float = 0.24, frequency: float = 95) -> np.ndarray:
    count = int(duration * RATE)
    t = np.arange(count) / RATE
    body = np.sin(2 * np.pi * frequency * t) * np.exp(-t * 19)
    transient = filtered_noise(duration, 0.28, 4, release=duration * 0.86)
    return (body * volume) + transient


def rustle(duration: float = 0.7, volume: float = 0.24, strokes: int = 4) -> np.ndarray:
    result = np.zeros(int(duration * RATE))
    for index in range(strokes):
        start = int((0.03 + index * duration / (strokes + 1)) * RATE)
        size = min(len(result) - start, int((0.1 + index * 0.015) * RATE))
        if size <= 0:
            continue
        stroke = filtered_noise(size / RATE, volume * (1 - index * 0.08), 7, release=size / RATE * 0.7)
        usable = min(size, len(stroke))
        result[start:start + usable] += stroke[:usable]
    return result


def scrape(duration: float = 0.75, volume: float = 0.25) -> np.ndarray:
    count = int(duration * RATE)
    noise = filtered_noise(duration, volume, 18, attack=0.08, release=0.18)
    t = np.arange(count) / RATE
    texture = (0.65 + 0.35 * np.sin(2 * np.pi * (17 + 8 * t) * t))
    return noise * texture


def sequence(duration: float, *events: tuple[float, np.ndarray]) -> np.ndarray:
    result = np.zeros(max(1, int(duration * RATE)))
    for start, sound in events:
        offset = int(start * RATE)
        end = min(len(result), offset + len(sound))
        if offset < len(result) and end > offset:
            result[offset:end] += sound[:end - offset]
    return result


def bell(root: float = 660, duration: float = 1.0, volume: float = 0.28) -> np.ndarray:
    return tone(duration, root, volume, release=duration * 0.8,
                harmonics=((2.01, 0.34), (3.98, 0.12), (6.12, 0.05)))


def ui_chord(notes: tuple[float, ...], spacing: float = 0.11, volume: float = 0.22) -> np.ndarray:
    return sequence(spacing * (len(notes) - 1) + 0.62,
                    *((index * spacing, bell(note, 0.55, volume)) for index, note in enumerate(notes)))


def make_sounds() -> dict[str, tuple[np.ndarray, str, float]]:
    paper_open = sequence(0.95, (0.0, rustle(0.78, 0.24, 5)), (0.64, impact(0.2, 0.2, 170)))
    drawer_open = sequence(1.05, (0.0, scrape(0.76, 0.28)), (0.72, impact(0.35, 0.25, 82)),
                           (0.82, rustle(0.2, 0.12, 2)))
    seal = sequence(0.72, (0.05, filtered_noise(0.12, 0.18, 5)), (0.12, impact(0.62, 0.35, 74)),
                    (0.23, tone(0.45, 146, 0.1, release=0.4)))
    return {
        "access_authorized": (ui_chord((392, 523.25, 659.25), 0.12, 0.2), "Acceso autorizado", 0.34),
        "loading_pulse": (sequence(0.55, (0.0, tone(0.24, 190, 0.15, end_frequency=230)),
                                   (0.2, tone(0.28, 285, 0.1, release=0.2))), "Pulso de carga", 0.26),
        "credentials_confirmed": (ui_chord((523.25, 783.99), 0.09, 0.2), "Credenciales confirmadas", 0.32),
        "legal_notice_open": (paper_open, "Aviso legal desplegado", 0.34),
        "document_open_new": (sequence(1.25, (0.0, drawer_open), (0.7, paper_open),
                                       (0.96, bell(587.33, 0.25, 0.13))), "Documento nuevo abierto", 0.38),
        "document_open_read": (rustle(0.43, 0.17, 3), "Documento leído reabierto", 0.25),
        "recovery_step": (sequence(0.48, (0.0, tone(0.18, 250, 0.12, end_frequency=315)),
                                  (0.15, tone(0.25, 410, 0.09))), "Paso de recuperación", 0.24),
        "document_recovered": (sequence(0.95, (0.0, ui_chord((330, 440, 554.37), 0.1, 0.13)),
                                       (0.48, seal)), "Documento recuperado", 0.4),
        "folder_open": (drawer_open, "Carpeta abierta", 0.36),
        "page_turn": (sequence(0.48, (0.0, rustle(0.42, 0.22, 4)),
                               (0.31, filtered_noise(0.09, 0.11, 3))), "Paso de página", 0.28),
        "zoom_click": (sequence(0.19, (0.01, impact(0.18, 0.12, 330))), "Control de zoom", 0.19),
        "fullscreen_enter": (tone(0.52, 210, 0.15, end_frequency=475, release=0.24,
                                  harmonics=((2, 0.12),)), "Pantalla completa", 0.24),
        "reading_confirmed": (seal, "Lectura confirmada", 0.44),
        "action_error": (sequence(0.52, (0.0, tone(0.22, 190, 0.2, end_frequency=145)),
                                  (0.18, impact(0.18, 0.22, 60))), "Acción no permitida", 0.25),
        "document_unlocked": (ui_chord((293.66, 440, 587.33), 0.11, 0.18), "Documento desbloqueado", 0.34),
        "folder_unlocked": (sequence(1.15, (0.0, scrape(0.48, 0.16)),
                                     (0.38, ui_chord((261.63, 392, 523.25), 0.11, 0.16))), "Carpeta desbloqueada", 0.36),
        "card_highlight": (sequence(0.42, (0.0, tone(0.16, 510, 0.11)),
                                    (0.17, tone(0.2, 680, 0.13))), "Tarjeta nueva resaltada", 0.22),
        "comic_page_recovered": (sequence(1.15, (0.0, filtered_noise(0.72, 0.13, 30, attack=0.18)),
                                           (0.18, tone(0.62, 175, 0.09, end_frequency=620)),
                                           (0.68, bell(698.46, 0.42, 0.14))), "Página de AC-01 reconstruida", 0.34),
        "batch_completed": (sequence(0.9, (0.0, rustle(0.35, 0.17, 4)), (0.28, impact(0.32, 0.26, 92)),
                                    (0.43, ui_chord((392, 493.88, 587.33), 0.08, 0.11))), "Lote documental completado", 0.36),
        "ar06_warning": (sequence(1.15, (0.0, filtered_noise(0.22, 0.16, 2)),
                                  (0.12, tone(0.65, 83, 0.2, end_frequency=69, harmonics=((2.03, 0.2),))),
                                  (0.77, tone(0.22, 155, 0.15))), "Advertencia especial AR-06", 0.3),
        "ktb014_confirmed": (sequence(1.35, (0.0, seal), (0.33, impact(0.34, 0.5, 55)),
                                      (0.52, bell(392, 0.75, 0.15))), "KTB-014 confirmado", 0.45),
        "final_verification_step": (sequence(0.62, (0.0, tone(0.24, 170, 0.11, end_frequency=210)),
                                             (0.2, bell(466.16, 0.34, 0.11))), "Comprobación final", 0.25),
        "expedient_closed": (sequence(1.75, (0.0, impact(0.68, 0.5, 48)), (0.16, seal),
                                      (0.58, ui_chord((261.63, 392, 523.25, 659.25), 0.15, 0.15))), "Expediente cerrado", 0.5),
        "unexpected_file": (sequence(1.25, (0.0, filtered_noise(0.18, 0.2, 2)),
                                     (0.12, tone(0.78, 240, 0.14, end_frequency=74)),
                                     (0.67, impact(0.28, 0.3, 58))), "Archivo fuera de inventario", 0.32),
        "alberto_message": (sequence(1.35, (0.0, bell(587.33, 1.1, 0.16)),
                                     (0.28, paper_open * 0.52)), "Mensaje de Alberto recibido", 0.32),
        "alberto_letter_open": (sequence(1.5, (0.0, rustle(1.25, 0.23, 7)),
                                         (0.82, bell(523.25, 0.55, 0.11))), "Carta de Alberto abierta", 0.35),
        "response_registered": (sequence(0.85, (0.0, impact(0.2, 0.18, 260)),
                                         (0.14, tone(0.5, 300, 0.12, end_frequency=720)),
                                         (0.46, bell(720, 0.3, 0.11))), "Respuesta registrada", 0.3),
        "expedition_confirmed": (sequence(2.65, (0.0, seal), (0.32, impact(0.42, 0.42, 51)),
                                           (0.58, ui_chord((261.63, 329.63, 392, 523.25, 659.25), 0.19, 0.15)),
                                           (1.62, bell(783.99, 0.95, 0.12))), "Expedición confirmada", 0.52),
        "good_trip": (sequence(2.1, (0.0, bell(659.25, 1.75, 0.16)),
                               (0.34, bell(987.77, 1.5, 0.08))), "Buen viaje", 0.3),
    }


def save_wav(path: Path, samples: np.ndarray) -> dict[str, float]:
    samples = np.nan_to_num(samples)
    peak = float(np.max(np.abs(samples))) or 1.0
    if peak > 0.88:
        samples = samples * (0.88 / peak)
    pcm = np.int16(np.clip(samples, -1, 1) * 32767)
    with wave.open(str(path), "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(RATE)
        audio.writeframes(pcm.tobytes())
    rms = float(np.sqrt(np.mean(samples ** 2)))
    return {"duration": round(len(samples) / RATE, 3), "peak": round(float(np.max(np.abs(samples))), 4), "rms": round(rms, 4)}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = {"version": 1, "sampleRate": RATE, "format": "wav", "sounds": {}}
    for event, (samples, label, default_volume) in make_sounds().items():
        filename = f"{event}.wav"
        analysis = save_wav(OUTPUT / filename, samples)
        manifest["sounds"][event] = {
            "label": label,
            "file": filename,
            "defaultVolume": default_volume,
            **analysis,
        }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generados {len(manifest['sounds'])} sonidos en {OUTPUT}")


if __name__ == "__main__":
    main()
