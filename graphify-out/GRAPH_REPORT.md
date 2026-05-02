# Graph Report - melonui-web  (2026-05-03)

## Corpus Check
- Corpus is ~9,864 words - fits in a single context window. You may not need a graph.

## Summary
- 47 nodes · 41 edges · 10 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_getTargetSceneTime  getScrollProgress|getTargetSceneTime / getScrollProgress]]
- [[_COMMUNITY_getDeviceMemory  getSceneQuality|getDeviceMemory / getSceneQuality]]
- [[_COMMUNITY_LoadingScreen|LoadingScreen]]
- [[_COMMUNITY_SmallMelonSection|SmallMelonSection]]
- [[_COMMUNITY_FeaturesSection|FeaturesSection]]
- [[_COMMUNITY_SandSection|SandSection]]
- [[_COMMUNITY_LenisProvider|LenisProvider]]
- [[_COMMUNITY_HeroSection|HeroSection]]
- [[_COMMUNITY_ShowcaseSection|ShowcaseSection]]
- [[_COMMUNITY_PlantSection|PlantSection]]

## God Nodes (most connected - your core abstractions)
1. `clamp()` - 3 edges
2. `getScrollProgress()` - 3 edges
3. `getTargetSceneTime()` - 3 edges
4. `FeaturesSection()` - 2 edges
5. `HeroSection()` - 2 edges
6. `LenisProvider()` - 2 edges
7. `LoadingScreen()` - 2 edges
8. `PlantSection()` - 2 edges
9. `SandSection()` - 2 edges
10. `ShowcaseSection()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "getTargetSceneTime / getScrollProgress"
Cohesion: 0.27
Nodes (6): clamp(), getScrollProgress(), getTargetSceneTime(), stepSceneTime(), pseudoRandom(), randomBetween()

### Community 1 - "getDeviceMemory / getSceneQuality"
Cohesion: 0.4
Nodes (4): Melon(), getDeviceMemory(), getSceneQuality(), useSceneQuality()

### Community 2 - "LoadingScreen"
Cohesion: 0.5
Nodes (1): LoadingScreen()

### Community 3 - "SmallMelonSection"
Cohesion: 0.5
Nodes (1): SmallMelonSection()

### Community 5 - "FeaturesSection"
Cohesion: 1.0
Nodes (1): FeaturesSection()

### Community 6 - "SandSection"
Cohesion: 1.0
Nodes (1): SandSection()

### Community 7 - "LenisProvider"
Cohesion: 1.0
Nodes (1): LenisProvider()

### Community 8 - "HeroSection"
Cohesion: 1.0
Nodes (1): HeroSection()

### Community 9 - "ShowcaseSection"
Cohesion: 1.0
Nodes (1): ShowcaseSection()

### Community 10 - "PlantSection"
Cohesion: 1.0
Nodes (1): PlantSection()

## Knowledge Gaps
- **Thin community `LoadingScreen`** (4 nodes): `Home()`, `LoadingScreen()`, `page.tsx`, `LoadingScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SmallMelonSection`** (4 nodes): `Overlay()`, `SmallMelonSection()`, `Overlay.tsx`, `SmallMelonSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `FeaturesSection`** (2 nodes): `FeaturesSection()`, `FeaturesSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SandSection`** (2 nodes): `SandSection()`, `SandSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LenisProvider`** (2 nodes): `LenisProvider()`, `LenisProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HeroSection`** (2 nodes): `HeroSection()`, `HeroSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ShowcaseSection`** (2 nodes): `ShowcaseSection()`, `ShowcaseSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PlantSection`** (2 nodes): `PlantSection()`, `PlantSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._