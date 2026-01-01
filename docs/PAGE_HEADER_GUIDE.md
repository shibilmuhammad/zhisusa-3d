# PageHeader Component - Usage Guide

## Overview

The `PageHeader` component is a reusable navigation header designed for dedicated pages like Live, Work, Leisure, Gallery, and Booking. Unlike the homepage header which navigates to sections, this header navigates between different pages.

## Features

✅ **Page Navigation** - Links to different pages (not sections)
✅ **Home Link** - Always includes navigation back to homepage
✅ **Active State** - Highlights current page
✅ **Mobile Responsive** - Full mobile menu with animations
✅ **Brand Consistent** - Matches ZHISUSA visual identity
✅ **Color Themed** - Each page has its own color scheme
✅ **Reusable** - Easy to add to any page

## Usage

### Basic Implementation

```tsx
import { PageHeader } from "@/components/ui/PageHeader";

export default function LivePage() {
  return (
    <div className="page-container">
      <PageHeader currentPage="live" pageTitle="Live at ZHISUSA" />
      {/* Your page content */}
    </div>
  );
}
```

### Available Pages

The component supports these page types:

- `"live"` - Live/Accommodation page
- `"work"` - Work spaces page
- `"leisure"` - Leisure activities page
- `"gallery"` - Gallery page
- `"booking"` - Booking page

### Props

```typescript
interface PageHeaderProps {
  currentPage: "live" | "work" | "leisure" | "gallery" | "booking";
  pageTitle: string; // Display title (currently not used, reserved for future)
  pageColor?: string; // Optional custom color (uses default if not provided)
}
```

## Page Configuration

Each page has its own color scheme defined in `PageHeader.tsx`:

```typescript
const pageConfig = {
  live: {
    label: "Live",
    path: "/live",
    gradient: "linear-gradient(135deg, #ff8a50, #ffb380)",
    glowColor: "rgba(255, 138, 80, 0.4)",
  },
  work: {
    label: "Work",
    path: "/work",
    gradient: "linear-gradient(135deg, #0091ff, #4fc3f7)",
    glowColor: "rgba(0, 145, 255, 0.5)",
  },
  // ... etc
};
```

## Navigation Behavior

### Desktop
- Shows logo (links to home)
- Shows navigation items for all pages except current
- Active page is highlighted
- Smooth hover effects

### Mobile
- Hamburger menu button
- Full-screen overlay menu
- Animated menu items
- Active indicator
- Auto-closes on navigation

## Styling

The header uses:
- **Glassmorphism** - Premium glass effect
- **Fixed Position** - Stays at top while scrolling
- **Color Indicator** - Bottom glow bar matches page theme
- **Responsive** - Adapts to mobile screens

## Adding to New Pages

### Step 1: Import Component

```tsx
import { PageHeader } from "@/components/ui/PageHeader";
```

### Step 2: Add to Page

```tsx
export default function WorkPage() {
  return (
    <div className="work-page">
      <PageHeader currentPage="work" pageTitle="Work at ZHISUSA" />
      {/* Content */}
    </div>
  );
}
```

### Step 3: Add Page Spacing

Add padding-top to account for fixed header:

```css
.work-page {
  padding-top: 100px; /* Space for fixed header */
}
```

### Step 4: Update Page Config (if needed)

If creating a new page type, add it to `pageConfig` in `PageHeader.tsx`:

```typescript
const pageConfig = {
  // ... existing pages
  newpage: {
    label: "New Page",
    path: "/newpage",
    gradient: "linear-gradient(135deg, #color1, #color2)",
    glowColor: "rgba(r, g, b, 0.4)",
  },
};
```

## Current Implementation

### Live Page
✅ Header added to `/live`
✅ Header added to `/live/booking`
✅ Proper spacing configured

### Future Pages
- `/work` - Can use `<PageHeader currentPage="work" />`
- `/leisure` - Can use `<PageHeader currentPage="leisure" />`
- `/gallery` - Can use `<PageHeader currentPage="gallery" />`
- `/booking` - Can use `<PageHeader currentPage="booking" />`

## Navigation Structure

```
Homepage (/) 
  ↓ Uses different header (section navigation)
  
Live (/live)
  ↓ Uses PageHeader
  → Links: Home, Work, Leisure, Gallery, Booking
  
Work (/work)
  ↓ Uses PageHeader
  → Links: Home, Live, Leisure, Gallery, Booking
  
Leisure (/leisure)
  ↓ Uses PageHeader
  → Links: Home, Live, Work, Gallery, Booking
```

## Key Differences from Homepage Header

| Feature | Homepage Header | PageHeader |
|---------|----------------|------------|
| Navigation | Sections (scroll) | Pages (routes) |
| Purpose | Single page experience | Multi-page navigation |
| Active State | Current section | Current route |
| Mobile Menu | Section list | Page list |
| Usage | Homepage only | All other pages |

## Files

- **Component**: `src/components/ui/PageHeader.tsx`
- **Styles**: `src/components/ui/PageHeader.css`
- **Usage**: `app/live/page.tsx`, `app/live/booking/page.tsx`

## Customization

### Changing Colors

Edit `pageConfig` in `PageHeader.tsx`:

```typescript
live: {
  gradient: "linear-gradient(135deg, #your-color1, #your-color2)",
  glowColor: "rgba(r, g, b, 0.4)",
}
```

### Adding New Navigation Items

Add to `pageConfig` object and the component will automatically include it in navigation.

## Accessibility

✅ Keyboard navigation support
✅ ARIA labels on buttons
✅ Focus states
✅ Screen reader friendly
✅ Escape key closes menu

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Notes

- Header is fixed position, ensure page content has top padding
- Mobile menu uses portal to avoid overflow issues
- Active state uses Next.js `usePathname()` hook
- Menu auto-closes on route change

---

**Ready to use!** Simply import and add to any page. 🚀

