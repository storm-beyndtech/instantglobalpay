# Marketing Visual Components

Premium reusable visual elements for InstantGlobal marketing pages. All components use Framer Motion, support light/dark modes, and are fully configurable.

## Components

### BackgroundGrid

Premium grid/dot pattern for backgrounds (Apple/Vercel style).

**Variants:**
- `dots` - Subtle dot pattern (default)
- `lines` - Line grid pattern
- `squares` - Square grid pattern

**Props:**
- `variant` - Grid pattern type (default: `"dots"`)
- `cellSize` - Size of grid cells in pixels (default: `32`)
- `opacity` - Opacity of grid elements (default: `0.3`)
- `fade` - Enable edge fade effect (default: `true`)
- `animate` - Animate on mount (default: `true`)

**Usage:**
```tsx
import { BackgroundGrid, BackgroundGridWave } from "@/components/marketing/visuals";

// Basic dot grid
<BackgroundGrid variant="dots" cellSize={32} opacity={0.3} />

// Line grid with custom size
<BackgroundGrid variant="lines" cellSize={48} opacity={0.2} />

// Animated wave grid
<BackgroundGridWave variant="dots" cellSize={32} />
```

**Features:**
- SVG-based patterns for crisp rendering
- Automatic light/dark mode support
- Edge fade for seamless blending
- Optional wave animation
- Minimal performance impact

---

### BlurOrbs

Ambient glowing orbs using brand colors (green for marketing, purple for dashboard).

**Props:**
- `orbs` - Array of orb configurations (position, size, color, animation)
- `opacity` - Global opacity for all orbs (default: `0.4`)
- `animate` - Enable floating animation (default: `true`)

**Orb Config:**
```tsx
{
  size: number;        // Orb diameter in pixels
  color: string;       // CSS color value
  x: number;           // Horizontal position (%)
  y: number;           // Vertical position (%)
  blur?: number;       // Blur amount in pixels (default: 80)
  duration?: number;   // Animation duration in seconds (default: 20)
  delay?: number;      // Animation delay in seconds (default: 0)
}
```

**Usage:**
```tsx
import {
  BlurOrbs,
  MarketingBlurOrbs,
  DashboardBlurOrbs,
  SubtleBlurOrbs,
} from "@/components/marketing/visuals";

// Marketing orbs (green-based)
<MarketingBlurOrbs opacity={0.3} />

// Dashboard orbs (purple-based)
<DashboardBlurOrbs opacity={0.3} />

// Subtle orbs for light backgrounds
<SubtleBlurOrbs context="marketing" />

// Custom orbs
<BlurOrbs
  orbs={[
    { size: 500, color: "#22c55e", x: 20, y: 30, blur: 100, duration: 25 },
    { size: 400, color: "#10b981", x: 70, y: 60, blur: 80, duration: 30 },
  ]}
  opacity={0.4}
/>
```

**Features:**
- Smooth floating animations
- Multiple movement patterns (x, y, scale)
- Configurable blur intensity
- Independent animation timing per orb
- Low GPU usage with CSS filters

---

### OrbitalLines

Parallax Apple-like orbital rings that move with scroll.

**Props:**
- `orbitals` - Array of orbital configurations
- `parallax` - Enable parallax on scroll (default: `true`)
- `parallaxIntensity` - Scroll intensity multiplier (default: `0.5`)
- `centerX` - Center X position in % (default: `50`)
- `centerY` - Center Y position in % (default: `50`)

**Orbital Config:**
```tsx
{
  radius: number;           // Ring radius in pixels
  strokeWidth?: number;     // Line thickness (default: 1)
  opacity?: number;         // Line opacity (default: 0.2)
  duration?: number;        // Rotation duration in seconds (default: 30)
  direction?: "normal" | "reverse";  // Rotation direction
  delay?: number;           // Animation delay in seconds (default: 0)
}
```

**Usage:**
```tsx
import {
  OrbitalLines,
  CompactOrbitalLines,
  LargeOrbitalLines,
} from "@/components/marketing/visuals";

// Default orbital rings
<OrbitalLines />

// Compact rings for hero sections
<CompactOrbitalLines parallax={true} />

// Large rings for full-page backgrounds
<LargeOrbitalLines parallax={true} />

// Custom orbitals
<OrbitalLines
  orbitals={[
    { radius: 200, strokeWidth: 1, opacity: 0.15, duration: 40 },
    { radius: 300, strokeWidth: 0.5, opacity: 0.1, duration: 50, direction: "reverse" },
  ]}
  parallax={true}
  parallaxIntensity={0.6}
  centerX={50}
  centerY={40}
/>
```

**Features:**
- Parallax scroll effect
- Independent rotation per ring
- Bidirectional rotation
- SVG-based for scalability
- Dashed stroke pattern
- Subtle depth layering

---

### FloatingCards

Motion-floating card stack with smooth animations.

**Props:**
- `cards` - Array of card configurations
- `variant` - Card style: `"glass"`, `"elevated"`, or `"subtle"` (default: `"glass"`)

**Card Config:**
```tsx
{
  content: React.ReactNode;    // Card content (icon, text, component)
  x: number;                   // Horizontal position (%)
  y: number;                   // Vertical position (%)
  width?: number;              // Card width in pixels (default: 200)
  height?: number;             // Card height in pixels (default: 120)
  duration?: number;           // Float duration in seconds (default: 6)
  delay?: number;              // Animation delay in seconds (default: 0)
  floatDistance?: number;      // Vertical float distance in pixels (default: 20)
  rotation?: number;           // Rotation during float in degrees (default: 2)
}
```

**Usage:**
```tsx
import {
  FloatingCards,
  FloatingCardStack,
  FloatingCardGrid,
} from "@/components/marketing/visuals";
import { CreditCard, Globe, Zap } from "lucide-react";

// Scattered floating cards
<FloatingCards
  variant="glass"
  cards={[
    {
      content: <CreditCard className="h-8 w-8 text-primary-500" />,
      x: 15,
      y: 20,
      width: 180,
      height: 100,
      duration: 6,
    },
    {
      content: <Globe className="h-8 w-8 text-accent-500" />,
      x: 70,
      y: 50,
      width: 200,
      height: 120,
      duration: 8,
      delay: 2,
    },
  ]}
/>

// Stacked cards with stagger
<FloatingCardStack
  variant="elevated"
  cards={[
    { content: <div>Card 1</div>, width: 300, height: 200 },
    { content: <div>Card 2</div>, width: 300, height: 200 },
    { content: <div>Card 3</div>, width: 300, height: 200 },
  ]}
/>

// Grid of floating cards
<FloatingCardGrid
  variant="glass"
  cards={[
    { content: <Zap />, x: 10, y: 10, width: 150, height: 100 },
    { content: <Globe />, x: 50, y: 30, width: 150, height: 100 },
    { content: <CreditCard />, x: 80, y: 60, width: 150, height: 100 },
  ]}
/>
```

**Features:**
- Three layout modes: scattered, stacked, grid
- Glass, elevated, or subtle card styles
- Smooth floating animation
- Hover scale effect
- Staggered entrance animations
- Independent timing per card

---

## Combined Examples

### Hero Section with Multiple Layers
```tsx
<section className="relative min-h-screen">
  {/* Background layers */}
  <BackgroundGrid variant="dots" cellSize={32} opacity={0.2} />
  <MarketingBlurOrbs opacity={0.3} />
  <CompactOrbitalLines parallax={true} />

  {/* Content */}
  <div className="relative z-10">
    <h1>Your Hero Content</h1>
  </div>
</section>
```

### Full-Page Background
```tsx
<MarketingLayout
  backgroundLayers={
    <>
      <BackgroundGrid variant="lines" cellSize={48} opacity={0.15} />
      <BlurOrbs
        orbs={[
          { size: 600, color: "#22c55e", x: 20, y: 30, blur: 120 },
          { size: 500, color: "#10b981", x: 75, y: 65, blur: 100 },
        ]}
        opacity={0.25}
      />
      <LargeOrbitalLines parallax={true} />
    </>
  }
>
  {/* Your page content */}
</MarketingLayout>
```

### Feature Section with Floating Cards
```tsx
<section className="relative py-24">
  {/* Background */}
  <SubtleBlurOrbs context="marketing" />

  {/* Floating feature cards */}
  <FloatingCards
    variant="glass"
    cards={[
      {
        content: (
          <div className="text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary-500" />
            <p className="text-sm font-medium">Card Issuing</p>
          </div>
        ),
        x: 10,
        y: 20,
        width: 180,
        height: 120,
        duration: 6,
      },
      {
        content: (
          <div className="text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 text-primary-500" />
            <p className="text-sm font-medium">Global Reach</p>
          </div>
        ),
        x: 80,
        y: 60,
        width: 180,
        height: 120,
        duration: 7,
        delay: 2,
      },
    ]}
  />

  {/* Section content */}
  <div className="relative z-10 container">
    <h2>Features</h2>
  </div>
</section>
```

---

## Performance Tips

### Optimize for Production
1. **Reduce blur intensity** on mobile devices:
```tsx
const isMobile = window.innerWidth < 768;
<BlurOrbs opacity={isMobile ? 0.2 : 0.4} />
```

2. **Disable parallax on mobile** to improve scroll performance:
```tsx
const isMobile = window.innerWidth < 768;
<OrbitalLines parallax={!isMobile} />
```

3. **Limit number of floating elements** per view:
```tsx
// Good: 2-3 blur orbs, 3-4 orbital rings, 3-5 floating cards
// Too many: 10+ elements can impact performance
```

4. **Use `SubtleBlurOrbs`** for sections with heavy content:
```tsx
<SubtleBlurOrbs context="marketing" /> // Lower opacity, higher blur
```

---

## Light/Dark Mode

All components automatically adapt to theme:
- Grid patterns use `text-foreground/20` (light) and `text-foreground/10` (dark)
- Blur orbs maintain consistent appearance across themes
- Orbital lines adjust opacity based on theme
- Floating cards use theme-aware glass/elevated styles

No additional configuration needed!

---

## Accessibility

All visual components are **decorative only**:
- `pointer-events-none` prevents interaction
- Hidden from screen readers (decorative SVGs)
- No impact on keyboard navigation
- Content remains fully accessible

---

## Import Shortcuts

```tsx
// Import all visual components
import {
  BackgroundGrid,
  BackgroundGridWave,
  BlurOrbs,
  MarketingBlurOrbs,
  DashboardBlurOrbs,
  OrbitalLines,
  CompactOrbitalLines,
  LargeOrbitalLines,
  FloatingCards,
  FloatingCardStack,
  FloatingCardGrid,
} from "@/components/marketing/visuals";
```
