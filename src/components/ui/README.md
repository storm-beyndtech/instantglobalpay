# InstantGlobal UI Primitives

Complete UI primitive kit for InstantGlobal, following Apple-style design principles with glassmorphism, depth shadows, and smooth interactions.

## Components

### Button

Apple-tier button component with multiple variants for marketing and dashboard contexts.

**Variants:**
- `primary` - Green gradient with glow (marketing CTAs)
- `primary-purple` - Purple gradient (dashboard CTAs)
- `outline` - Border only with hover state
- `subtle` - Subtle accent background (dashboard)
- `ghost` - No background, hover only
- `glass` - Liquid glass translucent
- `gradient` - Multi-color gradient
- `destructive` - Red for dangerous actions
- `link` - Text link with underline

**Sizes:** `sm`, `default`, `lg`, `xl`, `icon`

**Usage:**
```tsx
import { Button } from "@/components/ui";

// Marketing CTA
<Button variant="primary">Get Started</Button>

// Dashboard action
<Button variant="primary-purple">Create Account</Button>

// Glass button
<Button variant="glass">Learn More</Button>
```

---

### Card

Flexible card component with depth and glass variants.

**Variants:**
- `default` - Solid background with depth shadow
- `elevated` - Apple-style high elevation
- `glass` - Liquid glass translucent with backdrop blur
- `ambient` - Card with gradient background

**Padding:** `none`, `sm`, `default`, `lg`

**Hover Effects:** `none`, `lift`, `glow`

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

<Card variant="glass" hover="lift">
  <CardHeader>
    <CardTitle>Payment Overview</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

---

### Badge

Small status indicators with multiple color variants.

**Variants:**
- `default` - Primary color background
- `secondary` - Secondary color
- `accent` - Purple for dashboard
- `success` - Green for success states
- `warning` - Amber for warnings
- `destructive` - Red for errors
- `outline` - Border only
- `glass` - Translucent glass

**Usage:**
```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="glass">Premium</Badge>
```

---

### Chip

Interactive tag/chip component with optional remove button and icon.

**Variants:**
- `default` - Default background
- `primary` - Green for marketing
- `accent` - Purple for dashboard
- `glass` - Translucent glass
- `outline` - Border only
- `success` - Green success state

**Sizes:** `sm`, `default`, `lg`

**Props:**
- `icon` - Leading icon element
- `onRemove` - Callback for remove button (shows X icon)

**Usage:**
```tsx
import { Chip } from "@/components/ui";
import { Check } from "lucide-react";

<Chip variant="accent" onRemove={() => handleRemove()}>
  Selected Tag
</Chip>

<Chip variant="success" icon={<Check className="h-3 w-3" />}>
  Verified
</Chip>
```

---

### Metric

KPI display component for dashboard and landing page statistics.

**Props:**
- `label` - Metric label (e.g., "Total Revenue")
- `value` - Metric value (number or string)
- `change` - Percentage change (optional)
- `changeLabel` - Label for change (e.g., "vs last month")
- `trend` - Force trend direction: `up`, `down`, `neutral` (auto-determined if omitted)
- `prefix` - Value prefix (e.g., "$")
- `suffix` - Value suffix (e.g., "%", "K")
- `description` - Additional description text

**Sizes:** `sm`, `default`, `lg`

**Usage:**
```tsx
import { Metric, MetricCard } from "@/components/ui";
import { TrendingUp } from "lucide-react";

// Basic metric
<Metric
  label="Total Volume"
  value="$2.4M"
  change={12.5}
  changeLabel="vs last month"
  trend="up"
/>

// Metric with card wrapper
<MetricCard
  variant="glass"
  icon={<TrendingUp className="h-5 w-5" />}
  label="Revenue Growth"
  value="24.8"
  suffix="%"
  change={5.2}
  changeLabel="vs last quarter"
/>
```

---

### ThemeToggle

Dark/light mode toggle with smooth icon transitions.

**Variants:**
- `ThemeToggle` - Icon button for headers
- `ThemeToggleCompact` - Full-width button for mobile menus

**Usage:**
```tsx
import { ThemeToggle, ThemeToggleCompact } from "@/components/ui";

// In navbar
<ThemeToggle />

// In mobile menu
<ThemeToggleCompact />
```

---

## Design Principles

### Marketing Context (Green)
- Use `variant="primary"` for CTAs
- Use `variant="glass"` for secondary actions
- Green color (#22c55e) reserved for CTAs only

### Dashboard Context (Purple)
- Use `variant="primary-purple"` for primary actions
- Use `variant="subtle"` for secondary actions
- Use `variant="accent"` for badges and chips
- Purple color (#a855f7) as primary accent

### Animations
All components include:
- Smooth transitions (300ms duration)
- Active scale states (0.98x on click)
- Hover effects (lift, glow, opacity)
- Apple-style micro-interactions

### Accessibility
All components include:
- Proper ARIA labels
- Semantic HTML
- Keyboard navigation support
- Focus indicators
- Disabled states

---

## Import Shortcuts

```tsx
// Import all components
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Chip,
  Metric,
  MetricCard,
  ThemeToggle,
} from "@/components/ui";
```

---

## Showcase

View all components in action:
```tsx
import { UIShowcase } from "@/components/ui/showcase";

<UIShowcase />
```
