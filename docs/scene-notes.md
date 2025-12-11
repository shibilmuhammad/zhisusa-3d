# ZHISUSA 3D Journey – Scene Notes

## Camera + Environment

- Camera easing: exponential lerp with `speed ≈ 2.4`; targets and positions defined in `sceneSequence`.
- Fog + background shift between scenes via colour lerp and animated near/far planes.
- Environment lighting swaps through Drei presets (`dawn`, `forest`, `studio`, `sunset`, `city`, `night`, `park`) with interpolated intensity.
- Directional key light warms/cools by scene; bloom intensity adapts to highlight focal elements.

## Section Breakdown

### Hero / Welcome
- Model: `hero-environment.glb` (`scale ≈ 3.4`, pivot at ground).
- Dynamics: clouds orbit slowly; logo float scales with scroll progress.
- Lighting: cool dawn hues (`fogColor: #0A1A2F`, `lightColor: #88C9FF`).

### Live
- Model: `live-villa.glb` (`scale ≈ 1.5`).
- Animation hooks: node `Door` (rotation-y), `InteriorLight` (scale + elevation).
- Scroll effect: villa levitates slightly, door opens at peak, interior glow blooms.
- Palette: warm sand + aqua highlights.

### Work
- Model: `work-hub.glb` (`scale ≈ 1.5`).
- Hotspots: spheres over `Smart Desk`, `Concept Table`, `Vista Glass` with glassmorphic labels.
- Dynamic nodes: `SunTrack` (azimuth spin) + `DeskLight` (emissive pulse).
- Lighting: crisp glasshouse blue with subtle neon accent.

### Leisure
- Model: `leisure-lake.glb` (`scale ≈ 1.8`).
- Nodes: `Campfire` (flame pulse), `Trees` group (gentle sway).
- Extra meshes: fallback evergreens & firepit in case model missing.
- Atmosphere: water ripple sway, sunset warmth.

### Booking
- Procedural glassmorphic booking card synced with overlay CTA.
- Scroll: card rises, tilts forward, CTA bar glows.

### Gallery
- Model: `gallery-frame.glb` repeated (parallax offsets driven by scroll progress).
- Frames float on arcs; emissive glass pulses when active.

### Footer
- Model: `footer-map.glb` (`scale ≈ 2.2`).
- Animated path: ring of glowing tiles; node `Marker` optional for future highlight.
- Palette: deep indigo base with aqua path beacons.

## Scroll Timeline

- `ScrollSync` pulls progress directly from `@react-three/drei`'s `ScrollControls`.
- Store tracks `progress` and per-scene `sectionProgress` for targeted animations.
- Snap behaviour comes from weighting; virtual scroll length equals `sceneSequence.length * 1.1` viewport heights.

## Performance Notes

- Lazy GLTF loader clones meshes per render, applies shadow flags automatically.
- Canvas `frameloop="always"` (needed for subtle ambient motion); keep polycounts modest.
- Post-processing uses low sample bloom + vignette; adjust `sceneSequence[i].bloomIntensity` to tune.
- For mobile fallback consider reducing post-processing and particles via media queries / feature flags.


