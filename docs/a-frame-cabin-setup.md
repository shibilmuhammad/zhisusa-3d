# Cozy Cottage Model Setup

## Model Source
**[Cozy Cottage](https://sketchfab.com/3d-models/cozy-cottage-72c05612ebbc4f5f8eac26d047d5d69c)**
- Author: SINNIK
- Platform: Sketchfab
- License: CC Attribution (Free to use!)
- Triangles: 819.3k
- Vertices: 424.2k
- Features: Complete interior (kitchen, basement, attic), driveway, garage, yard, picket fence

## Download Instructions

### Step 1: Download from Sketchfab
1. Visit: https://sketchfab.com/3d-models/cozy-cottage-72c05612ebbc4f5f8eac26d047d5d69c
2. Click the **"Download 3D Model"** button (requires free Sketchfab account)
3. Select format: **glTF (.gltf/.glb)** ← IMPORTANT
4. Download quality: **Original** (recommended) or **High**
5. Extract the downloaded ZIP file

### Step 2: Prepare the Model
1. Locate the `.glb` file in the extracted folder
2. Rename it to: `cozy_cottage.glb`
3. Move it to: `/public/models/cozy_cottage.glb`

### Step 3: Verify Installation
```bash
# Check if file exists
ls -lh public/models/cozy_cottage.glb

# File size should be around 20-50 MB (detailed model with interior)
```

### Step 4: Restart Dev Server
```bash
# Stop the current dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

## Camera Views Configuration

The cozy cottage has **multiple camera views** that transition smoothly on scroll:

### View 1: Full Exterior (Live Section)
- **Wide shot** showing the entire cottage with yard, garage, and picket fence
- Camera position: `[10, 5, 14]`
- FOV: 55°
- Model rotation: 20° angle
- Shows: Complete cottage exterior, driveway, yard, surrounding environment

### View 2: Interior Workspace (Work Section)
- **Zoomed in** to the kitchen/workspace area
- Camera position: `[4, 3, 6]`
- FOV: 40° (tighter framing for detail)
- Model rotation: 35° to show interior
- Shows: Interior kitchen/workspace through window, cozy details

### View 3-6: Additional Views (Optional)
You can add more views for other sections by editing `/src/animations/constants.ts`:

```typescript
{
  key: "leisure",
  label: "Leisure",
  // View 3: Bedroom/loft area
  cameraPosition: [-4, 5, 6],
  cameraTarget: [0, 3, 0],
  cameraFov: 50,
  modelRotation: [0, Math.PI * -0.2, 0],
  // ... other properties
}
```

## Camera Animation Features

### Smooth Transitions
- **Position lerping**: Smooth camera movement between views
- **FOV animation**: Field of view changes for zoom effect
- **Model rotation**: Cabin rotates to show different angles
- **Easing**: Cubic easing for natural motion

### Scroll-Triggered
- Camera moves based on scroll position
- Each section has its own camera preset
- Transitions happen automatically when scrolling

### Performance Optimized
- Delta-based interpolation (60fps smooth)
- Efficient model loading with Suspense
- Fallback geometry if model fails to load

## Customization

### Adjust Camera Positions
Edit `/src/animations/constants.ts`:

```typescript
{
  key: "live",
  cameraPosition: [x, y, z],  // Adjust these values
  cameraTarget: [x, y, z],    // Where camera looks
  cameraFov: 60,              // Field of view (lower = zoomed in)
  modelRotation: [0, y, 0],   // Rotate the cabin
}
```

### Camera Position Guide
- **X**: Left (-) / Right (+)
- **Y**: Down (-) / Up (+)
- **Z**: Forward (-) / Backward (+)

### FOV Guide
- `70-80`: Wide angle (more visible)
- `50-60`: Normal view
- `30-45`: Zoomed in (telephoto)

### Model Rotation
- Y-axis rotation: `[0, Math.PI * 0.5, 0]` = 90° rotation
- Full circle: `Math.PI * 2`

## Troubleshooting

### Model Not Showing
1. Check file path: `/public/models/a_frame_cabin.glb`
2. Check file name (case-sensitive)
3. Restart dev server
4. Check browser console for errors

### Model Too Big/Small
Adjust scale in `/src/components/3DScenes/models/AFrameCabin.tsx`:

```typescript
<primitive
  object={cabinScene.clone()}
  scale={1.2}  // Increase or decrease this value
  // ...
/>
```

### Camera Too Close/Far
Adjust camera positions in `/src/animations/constants.ts`

### Transitions Too Fast/Slow
Adjust lerp factor in `AFrameCabin.tsx`:

```typescript
const lerpFactor = Math.min(delta * 2, 1); // Change the "2" value
// Lower = slower, Higher = faster
```

## Technical Details

### File Format
- **Format**: glTF Binary (.glb)
- **Version**: glTF 2.0
- **Textures**: Included in model
- **Animations**: None (static model)

### Performance
- **Triangles**: 819.3k (high detail with interior)
- **Vertices**: 424.2k
- **Load time**: ~3-5 seconds on 4G
- **Memory**: ~40-60 MB
- **FPS impact**: Moderate (detailed model)

### Features
✅ **Complete Interior**: Kitchen, basement, attic
✅ **Exterior Details**: Driveway, garage, yard
✅ **Picket Fence**: Full property boundary
✅ **Real-world Scale**: Properly dimensioned

### Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (may need WebGL 2.0 enabled)
- ⚠️ Mobile (may need reduced quality)

## Credits
Model by **SINNIK** on [Sketchfab](https://sketchfab.com/SINNIK)
License: **CC Attribution** (Free to use with attribution)

