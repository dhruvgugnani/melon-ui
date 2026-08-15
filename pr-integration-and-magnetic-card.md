# Magnetic Card and PR Integration

## Goal

Fix and verify Magnetic Card, integrate every distinct open component PR, land one complete CLI security fix, and keep the registry installable after every merge.

## Tasks

- [x] Inventory PRs #41-#57, local changes, and current `main` -> Verify: all PR heads are fetched from the same base commit.
- [x] Validate the existing Magnetic Card changes and finish the fix -> Verify: targeted lint, TypeScript, build, and pointer interaction pass.
- [ ] Compare security PRs #44, #46, #47, #49, #50, #52, #53, #55, and #57 -> Verify: selected fix removes shell execution and blocks unsafe package/path input.
- [ ] Integrate component PRs #41, #42, #43, #45, #48, #51, #54, and #56 individually -> Verify: each component renders, its primary interaction works, and its registry metadata/source agree.
- [ ] Land the selected security fix and mark the other security PRs superseded -> Verify: CLI tests/build pass and GitHub shows only the authoritative security change merged.
- [ ] Audit catalog-to-registry parity and CLI installation for all newly merged slugs -> Verify: every metadata entry resolves to an existing source file and installs in a clean fixture.
- [ ] Run final repository validation and update Graphify -> Verify: lint, typecheck, build, browser smoke/a11y checks, and `graphify update .` pass.

## Done When

- [ ] Magnetic Card and all distinct component PRs are present on `main` with meaningful commits pushed after each integration.
- [ ] One complete security fix is merged; duplicate security PRs are closed as superseded.
- [ ] Every added component is available from the registry and passes static plus interaction-level testing.
