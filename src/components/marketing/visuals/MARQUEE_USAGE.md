# Marquee System Usage Guide

Complete reusable infinite marquee system for logos, reviews, and metrics.

## Components

- **MarqueeContainer** - Wrapper with optional title/description
- **MarqueeRow** - Individual scrolling row with animation
- **MarqueeItem** - Base wrapper for items
- **MarqueeLogo** - Pre-styled logo wrapper
- **MarqueeReview** - Pre-styled review card
- **MarqueeMetric** - Pre-styled metric card

## Quick Start

### Logo Marquee

```tsx
import { LogoMarquee, MarqueeLogo } from "@/components/marketing/visuals";

const logos = [
  <MarqueeLogo src="/logos/company1.svg" alt="Company 1" />,
  <MarqueeLogo src="/logos/company2.svg" alt="Company 2" />,
  <MarqueeLogo src="/logos/company3.svg" alt="Company 3" />,
  // Add more logos...
];

export function TrustedBySection() {
  return (
    <LogoMarquee
      logos={logos}
      title="Trusted by industry leaders"
      description="Join 10,000+ businesses using InstantGlobal"
      duration={35}
    />
  );
}
```

### Review Marquee

```tsx
import { ReviewMarquee, MarqueeReview } from "@/components/marketing/visuals";

const reviews = [
  <MarqueeReview
    author="Sarah Chen"
    role="CFO"
    company="TechCorp"
    content="InstantGlobal transformed how we handle global payments. The API is incredibly easy to integrate."
    rating={5}
  />,
  <MarqueeReview
    author="Michael Roberts"
    role="Head of Finance"
    company="GlobalScale"
    content="We reduced our payment processing costs by 40% after switching to InstantGlobal."
    rating={5}
  />,
  // Add more reviews...
];

export function TestimonialsSection() {
  return (
    <ReviewMarquee
      reviews={reviews}
      title="What our customers say"
      description="Real feedback from businesses like yours"
      duration={40}
    />
  );
}
```

### Custom Marquee with MarqueeRow

```tsx
import {
  MarqueeContainer,
  MarqueeRowWithFade,
  MarqueeItem,
} from "@/components/marketing/visuals";

export function CustomMarquee() {
  return (
    <MarqueeContainer title="Custom Content" rowSpacing="lg">
      {/* Row 1: Left to Right */}
      <MarqueeRowWithFade direction="left" duration={30} pauseOnHover>
        {items.map((item, i) => (
          <MarqueeItem key={i}>
            {/* Your custom content */}
          </MarqueeItem>
        ))}
      </MarqueeRowWithFade>

      {/* Row 2: Right to Left (mirrored) */}
      <MarqueeRowWithFade direction="right" duration={35} pauseOnHover>
        {items.map((item, i) => (
          <MarqueeItem key={i}>
            {/* Your custom content */}
          </MarqueeItem>
        ))}
      </MarqueeRowWithFade>
    </MarqueeContainer>
  );
}
```

## Configuration

### Duration Range
- **Fast**: 25-30 seconds
- **Medium**: 30-40 seconds (recommended)
- **Slow**: 40-45 seconds

### Direction
- `"left"` - Scrolls from right to left
- `"right"` - Scrolls from left to right

### Pause on Hover
- Set `pauseOnHover={true}` to pause animation when hovering
- Default: `true`

## Pre-configured Components

### LogoMarquee
Automatically splits logos into 2 rows with mirrored directions.

### ReviewMarquee
Automatically splits reviews into 2 rows with mirrored directions.

### MarqueeRowWithFade
Includes gradient fade overlays on both edges.

## Examples for Project Pages

### Hero Section
```tsx
// In hero-overkill.tsx - Trust Indicators
<LogoMarquee
  logos={trustedLogos}
  duration={35}
/>
```

### Footer
```tsx
// In site-footer.tsx - Partner Logos
<MarqueeContainer rowSpacing="sm">
  <MarqueeRowWithFade direction="left" duration={40}>
    {partnerLogos.map((logo, i) => (
      <MarqueeLogo key={i} {...logo} />
    ))}
  </MarqueeRowWithFade>
</MarqueeContainer>
```

### Product Pages
```tsx
// In products/api/page.tsx - Customer Testimonials
<ReviewMarquee
  reviews={apiReviews}
  title="Loved by developers"
  duration={40}
/>
```

## Performance Tips

1. **Optimize Images**: Use optimized SVGs or WebP for logos
2. **Limit Items**: Keep 8-12 items per row for best performance
3. **Use Duplicates**: System auto-duplicates content for seamless loop
4. **Lazy Load**: Consider lazy loading marquee sections below fold

## Accessibility

- Marquee pauses on hover by default
- Use descriptive alt text for logos
- Ensure sufficient color contrast in review cards
- Consider adding `prefers-reduced-motion` support if needed
