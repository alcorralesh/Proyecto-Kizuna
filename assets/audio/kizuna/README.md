# Paquete sonoro KIZUNA

Colección original generada para la experiencia de consulta de expedientes. Todos los efectos son mono, PCM de 16 bits y 44,1 kHz. No utilizan grabaciones ni recursos externos.

## Grupos

- **Acceso:** `access_authorized`, `loading_pulse`, `credentials_confirmed`, `legal_notice_open`.
- **Lectura:** `document_open_new`, `document_open_read`, `recovery_step`, `document_recovered`, `folder_open`, `page_turn`, `zoom_click`, `fullscreen_enter`.
- **Progreso:** `reading_confirmed`, `action_error`, `document_unlocked`, `folder_unlocked`, `card_highlight`, `comic_page_recovered`, `batch_completed`.
- **Momentos especiales:** `ar06_warning`, `ktb014_confirmed`, `final_verification_step`, `expedient_closed`, `unexpected_file`.
- **Alberto y desenlace:** `alberto_message`, `alberto_letter_open`, `response_registered`, `expedition_confirmed`, `good_trip`.

`manifest.json` contiene el nombre visible, archivo, duración, volumen recomendado y mediciones de cada efecto. Los ficheros pueden regenerarse ejecutando `scripts/generate_kizuna_audio.py`.
