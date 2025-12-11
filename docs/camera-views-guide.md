# Camera Views Guide - A-Frame Cabin

## Scroll-Based Camera Journey

### 🎬 Scene Flow

```
┌─────────────────────────────────────────────────────────────┐
│  HERO SECTION (Welcome)                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Shows: Photo cards with tree scene                        │
│  Camera: Standard view                                      │
│  FOV: 60°                                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓ SCROLL DOWN
                            ↓ Smooth transition...
┌─────────────────────────────────────────────────────────────┐
│  LIVE SECTION - VIEW 1: Full Exterior                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│                    🏠 A-FRAME CABIN                         │
│                   /\                                        │
│                  /  \                                       │
│                 /    \                                      │
│                /______\                                     │
│               |  🪟  |                                      │
│               |______|                                      │
│                                                             │
│  Camera Position: [8, 4, 12]                               │
│  Looking At: [0, 2, 0]                                     │
│  FOV: 60° (wide shot)                                      │
│  Model Rotation: 15° (slight angle)                        │
│                                                             │
│  What You See:                                             │
│  ✓ Complete cabin exterior                                 │
│  ✓ A-frame triangular structure                            │
│  ✓ Surrounding environment                                 │
│  ✓ Deck/patio area                                         │
│  ✓ Warm lighting from windows                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ SCROLL DOWN
                            ↓ Camera slides & zooms in...
                            ↓ FOV narrows to 45°
┌─────────────────────────────────────────────────────────────┐
│  WORK SECTION - VIEW 2: Interior Workspace                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│         🪟 [ZOOMED VIEW THROUGH WINDOW]                    │
│        ┌─────────────────────┐                             │
│        │                     │                             │
│        │   💻  📚  ☕        │                             │
│        │  ┌────┐            │                             │
│        │  │DESK│            │                             │
│        │  └────┘            │                             │
│        │                     │                             │
│        └─────────────────────┘                             │
│                                                             │
│  Camera Position: [3.5, 2.8, 5]                            │
│  Looking At: [0, 2.2, 0]                                   │
│  FOV: 45° (zoomed in)                                      │
│  Model Rotation: 25° (rotated to show interior)            │
│                                                             │
│  What You See:                                             │
│  ✓ Workspace/desk area                                     │
│  ✓ Interior furnishings                                    │
│  ✓ Laptop and work setup                                   │
│  ✓ Cozy cabin details                                      │
│  ✓ Natural lighting                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ SCROLL DOWN
                            ↓ Transition back to photo cards...
┌─────────────────────────────────────────────────────────────┐
│  LEISURE SECTION                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Shows: Beach/leisure photo cards                          │
│  Camera: Returns to standard view                          │
└─────────────────────────────────────────────────────────────┘
```

## 🎥 Camera Animation Details

### Transition from HERO → LIVE
```
Duration: ~1-2 seconds (smooth scroll)
Movement:
  - Camera pulls back and up
  - Photo cards fade out
  - A-frame cabin fades in
  - Model rotates 15° for better angle
  - FOV stays at 60° (wide)
```

### Transition from LIVE → WORK
```
Duration: ~1-2 seconds (smooth scroll)
Movement:
  - Camera slides closer (12 → 5 units)
  - Camera moves right and up slightly
  - FOV narrows (60° → 45°) = ZOOM EFFECT
  - Model rotates 10° more (15° → 25°)
  - Focus shifts to interior workspace
```

### Transition from WORK → LEISURE
```
Duration: ~1-2 seconds (smooth scroll)
Movement:
  - A-frame cabin fades out
  - Photo cards fade in
  - Camera returns to standard position
  - FOV returns to 60°
```

## 📐 Technical Breakdown

### View 1: Full Exterior (LIVE)
```typescript
{
  cameraPosition: [8, 4, 12],    // Far back and up
  cameraTarget: [0, 2, 0],       // Looking at cabin center
  cameraFov: 60,                 // Wide angle
  modelRotation: [0, 0.47, 0],   // 15° rotation (π * 0.15)
}
```

**Visual Effect:**
- Establishes the cabin in its environment
- Shows scale and architecture
- Inviting wide shot
- "This is where you'll live"

### View 2: Interior Workspace (WORK)
```typescript
{
  cameraPosition: [3.5, 2.8, 5], // Closer, slightly higher
  cameraTarget: [0, 2.2, 0],     // Looking at desk height
  cameraFov: 45,                 // Narrower = zoomed in
  modelRotation: [0, 0.79, 0],   // 25° rotation (π * 0.25)
}
```

**Visual Effect:**
- Intimate view of workspace
- Zoom creates focus
- Shows interior details
- "This is where you'll work"

## 🎨 Animation Properties

### Smooth Lerping
```typescript
lerpFactor = delta * 2  // Smooth but responsive
```
- Not instant jumps
- Follows scroll naturally
- Feels cinematic

### FOV Animation
```typescript
camera.fov = lerp(currentFov, targetFov, lerpFactor * 0.5)
```
- Slower FOV change = more dramatic
- Creates zoom effect
- Professional cinematography

### Model Rotation
```typescript
rotation.y = lerp(currentRotation, targetRotation, lerpFactor * 0.8)
```
- Cabin rotates to show best angle
- Synchronized with camera movement
- Reveals different features

## 🎯 Customization Tips

### Want More Views?
Add to `constants.ts`:

```typescript
// View 3: Bedroom/Loft
{
  key: "leisure",
  cameraPosition: [-4, 5, 6],   // Left side, high up
  cameraTarget: [0, 3, 0],      // Looking at loft
  cameraFov: 50,
  modelRotation: [0, -0.63, 0], // -20° rotation
}

// View 4: Kitchen Area
{
  key: "booking",
  cameraPosition: [5, 2.5, 4],  // Right side, medium height
  cameraTarget: [0, 1.8, 0],    // Looking at kitchen
  cameraFov: 48,
  modelRotation: [0, 1.57, 0],  // 90° rotation
}

// View 5: Outdoor Deck
{
  key: "gallery",
  cameraPosition: [6, 1.5, 8],  // Low angle, far back
  cameraTarget: [0, 1, 2],      // Looking at deck
  cameraFov: 55,
  modelRotation: [0, 0, 0],     // Front view
}

// View 6: Aerial View
{
  key: "footer",
  cameraPosition: [0, 10, 10],  // High above
  cameraTarget: [0, 0, 0],      // Looking down
  cameraFov: 65,
  modelRotation: [0, 0.79, 0],  // 25° rotation
}
```

### Adjust Transition Speed
In `AFrameCabin.tsx`:

```typescript
// Slower transitions
const lerpFactor = Math.min(delta * 1, 1);  // Half speed

// Faster transitions
const lerpFactor = Math.min(delta * 4, 1);  // Double speed

// Current (balanced)
const lerpFactor = Math.min(delta * 2, 1);  // Default
```

### Change Zoom Intensity
```typescript
// More dramatic zoom
cameraFov: 35,  // Very tight

// Less dramatic zoom
cameraFov: 50,  // Subtle zoom

// No zoom
cameraFov: 60,  // Same as wide shot
```

## 🎬 Pro Tips

1. **Wide → Tight**: Start with wide shot (FOV 60-70), zoom to tight (FOV 35-45)
2. **High → Low**: Move camera down as you zoom in for intimacy
3. **Rotate Model**: Don't just move camera, rotate model too
4. **Timing**: Slower transitions feel more cinematic
5. **Easing**: Use cubic easing for natural motion

## 📱 Mobile Considerations

On mobile, the transitions still work but:
- Slightly faster (less screen space to scroll)
- May reduce FOV range (60° → 50° instead of 60° → 45°)
- Simplified lighting for performance

## 🚀 Performance

- **60 FPS** smooth on desktop
- **30-60 FPS** on mobile
- **Delta-based** animation (frame-rate independent)
- **Efficient lerping** (no heavy calculations)
- **Lazy loading** (cabin only loads when needed)

