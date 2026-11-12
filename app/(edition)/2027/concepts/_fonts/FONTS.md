# Concept fonts (internal design exploration)

Self-hosted so concept builds never depend on fetching Google Fonts at build
time (see PR #14). Latin subset, woff2, from the Fontsource npm packages
(version 5.2.5). Each family is licensed under the SIL Open Font License 1.1;
the OFL-*.txt files are the licence texts shipped with the packages.

| Family | Files | Copyright (per the upstream projects; confirm before any production use) |
| --- | --- | --- |
| Bodoni Moda (variable: opsz, wght; normal + italic) | bodoni-moda-latin-opsz-*.woff2 | The Bodoni Moda Project Authors (github.com/indestructible-type/Bodoni) |
| Manrope (variable: wght) | manrope-latin-wght-normal.woff2 | The Manrope Project Authors (github.com/sharanda/manrope) |
| Italiana (400) | italiana-latin-400-normal.woff2 | Santiago Orozco |
| Jost (variable: wght; normal + italic) | jost-latin-wght-*.woff2 | The Jost Project Authors (github.com/indestructible-type/Jost) |
