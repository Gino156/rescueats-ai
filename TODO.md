# TODO

## Gemini API

- [x] Fix unsupported model id (`gemini-1.5-flash` 404) by using supported Gemini model IDs.
- [ ] (Optional) Add automatic model listing at runtime and pick the first model that supports `generateContent()`.

## UI / Output Quality

- [ ] Add better handling when the model returns empty/placeholder results (e.g., show guidance to upload a clearer photo).
- [ ] Improve carbon/water savings estimation methodology (currently uses model inference).

## Testing

- [ ] Add a simple automated test script to validate the endpoint returns parseable JSON and required schema keys.

