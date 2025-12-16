# InstantGlobal Marketing Layout System

Complete layout system for marketing pages with Apple-style glass navigation, premium pill links, and minimal footer.

## Components

### SiteHeader

Premium glass navigation bar with liquid glass blur effect, pill-style links, and smooth animations.

**Features:**
- Fixed position with backdrop blur
- Scroll-responsive opacity (increases on scroll)
- Pill-style navigation links with hover states
- Premium glass CTA button
- Mobile-responsive with slide-down menu
- Framer Motion animations
- Theme toggle integration

**Desktop Navigation:**
- Pill-style links with subtle hover effects
- Layout animation between active states
- Glass CTA button with depth shadow
- Theme toggle button

**Mobile Navigation:**
- Hamburger menu with smooth open/close
- Backdrop blur overlay
- Staggered link animations
- Full-width glass CTA

**Usage:**
```tsx
import { SiteHeader } from "@/components/layout";

// Automatically included in MarketingLayout
// Or use standalone:
<SiteHeader />
```

---

### SiteFooter

Elegantly minimal footer following ANODA design principles.

**Features:**
- Multi-column layout (6 columns on desktop, responsive)
- Brand section with logo and description
- Social media links (Twitter, LinkedIn, GitHub, Email)
- Product, Company, Legal, Resources sections
- Bottom bar with copyright and legal links
- Clean typography and spacing

**Sections:**
- **Product**: Features, Pricing, API Docs, Integration
- **Company**: About, Careers, Blog, Contact
- **Legal**: Privacy, Terms, Security, Compliance
- **Resources**: Help Center, Guides, Status, Changelog

**Usage:**
```tsx
import { SiteFooter } from "@/components/layout";

// Automatically included in MarketingLayout
// Or use standalone:
<SiteFooter />
```

---

### MarketingLayout

Main layout wrapper for all marketing pages with optional background layers.

**Props:**
- `children` - Page content
- `withAmbientGradient` - Add green-based ambient gradient background
- `backgroundLayers` - Custom background visual elements (grid, mesh, floating)
- `className` - Additional classes for main content
- `noPadding` - Remove default container padding

**Features:**
- Includes SiteHeader and SiteFooter
- Fixed background layer system
- Ambient gradient support
- Flexible content area
- Responsive container

**Usage:**
```tsx
import { MarketingLayout } from "@/components/layout";

// Basic layout
export default function Page() {
  return (
    <MarketingLayout>
      <h1>Your Content</h1>
    </MarketingLayout>
  );
}

// With ambient gradient
export default function Page() {
  return (
    <MarketingLayout withAmbientGradient>
      <h1>Your Content</h1>
    </MarketingLayout>
  );
}

// With custom background layers
export default function Page() {
  return (
    <MarketingLayout
      backgroundLayers={
        <>
          <GridPattern />
          <FloatingElements />
        </>
      }
    >
      <h1>Your Content</h1>
    </MarketingLayout>
  );
}

// Full-width content (no container padding)
export default function Page() {
  return (
    <MarketingLayout noPadding>
      <HeroSection />
      <FeaturesSection />
    </MarketingLayout>
  );
}
```

---

### SimpleMarketingLayout

Simplified layout wrapper without background layers or container.

**Usage:**
```tsx
import { SimpleMarketingLayout } from "@/components/layout";

export default function Page() {
  return (
    <SimpleMarketingLayout>
      {/* Your full-width content */}
    </SimpleMarketingLayout>
  );
}
```

---

## Design Principles

### Glass Navigation (Apple-style)
- **Backdrop blur**: 20px blur with saturation boost
- **Translucent background**: 75% opacity (increases to 85% on scroll)
- **Border**: Subtle glass border with 10-20% opacity
- **Shadow**: Depth shadow for elevation
- **Transitions**: Smooth 300ms transitions

### Pill Links (Clyde-level)
- **Shape**: Fully rounded (`rounded-pill`)
- **Hover**: Subtle background fade (10% accent color)
- **Active**: Layout animation for smooth transitions
- **Typography**: Medium weight, letter-spacing optimized

### Premium CTA
- **Style**: Glass button with depth shadow
- **Hover**: Scale 1.02, increased shadow
- **Icon**: Arrow with subtle translate on hover
- **No typical green**: Uses glass variant for premium feel

### Footer (ANODA-style)
- **Layout**: Clean grid with ample spacing
- **Typography**: Small, muted colors for secondary content
- **Links**: Subtle hover states (muted → foreground)
- **Social**: Icon-only links in rounded squares
- **Bottom bar**: Thin border separator

---

## Customization

### Navigation Links

Edit links in `site-header.tsx`:
```tsx
const navigationLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
```

### Footer Links

Edit sections in `site-footer.tsx`:
```tsx
const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      // Add more links...
    ],
  },
  // Add more sections...
};
```

### Social Links

Edit social links in `site-footer.tsx`:
```tsx
const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  // Add more social links...
];
```

---

## Animations

### Header Scroll Animation
- Background opacity increases from 70% to 85%
- Border opacity increases from 10% to 20%
- Smooth spring-based transitions

### Mobile Menu Animation
- Menu slides down with 20px offset
- Backdrop fades in/out
- Links stagger with 50ms delay
- 200ms ease-out timing

### Link Hover Animation
- Pill background fades in
- Text color brightens
- Layout animation between states
- 300ms transition duration

---

## Accessibility

### Header
- Semantic `<nav>` element
- Proper ARIA labels for buttons
- Keyboard navigation support
- Focus indicators on all interactive elements

### Footer
- Semantic `<footer>` element
- Descriptive link text
- External links with `rel="noopener noreferrer"`
- Social links with ARIA labels

### Mobile Menu
- Focus trap when open
- ESC key to close (native)
- Touch-friendly tap targets (min 44px)

---

## Example Page

```tsx
import { MarketingLayout } from "@/components/layout";
import { Button } from "@/components/ui";

export default function FeaturesPage() {
  return (
    <MarketingLayout withAmbientGradient>
      {/* Hero Section */}
      <section className="section-spacing-lg text-center">
        <h1 className="text-display-xl font-bold mb-6">
          Global Payment Infrastructure
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Move money across borders instantly with modern APIs
          and infrastructure-grade reliability.
        </p>
        <Button variant="primary" size="xl">
          Get Started
        </Button>
      </section>

      {/* Features Grid */}
      <section className="section-spacing-md">
        {/* Your features content */}
      </section>
    </MarketingLayout>
  );
}
```

---

## Import Shortcuts

```tsx
// Import all layout components
import {
  SiteHeader,
  SiteFooter,
  MarketingLayout,
  SimpleMarketingLayout,
} from "@/components/layout";
```

---

## Technical Notes

### Fixed Header
- Header is `fixed` positioned with `z-50`
- Includes spacer `div` to prevent content jump
- Height: 64px (h-16)

### Container System
- Uses `container-wide` (max-w-7xl)
- Uses `container-padding` (responsive padding)
- Can be disabled with `noPadding` prop

### Theme Support
- Automatically adapts to light/dark mode
- Glass colors switch via CSS variables
- Theme toggle in header

### Performance
- Framer Motion with optimized animations
- Scroll listener with `useScroll` hook
- Conditional mobile menu rendering
- No layout shifts on theme toggle
