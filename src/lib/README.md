# InstantGlobal Data Library

## Products Data Structure

### `products.ts`

Complete product catalog with original fintech content.

**Products:**
1. **Global Accounts** - Multi-currency accounts (50+ currencies)
2. **Card Issuing** - Physical + virtual cards with controls
3. **Global Payouts** - Cross-border payments (same-day settlement)
4. **FX & Treasury** - Competitive rates, spot/forward contracts
5. **Travel Payments** - Zero FX fees, travel-optimized cards
6. **Developer APIs** - RESTful APIs with SDKs

**Data Structure:**
```tsx
interface Product {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  tagline: string;               // Short description
  description: string;           // Full description
  icon: LucideIcon;              // Icon component
  color: "primary" | "accent";   // Theme color
  href: string;                  // Product page URL
  features: string[];            // Feature list
  useCases: UseCase[];           // Use case scenarios
  stats?: ProductStat[];         // Product metrics
}
```

**Use Cases:**
Each product includes 3 use cases with:
- Title
- Description
- Benefits (3 bullet points)

**Stats:**
Key metrics for each product (label, value, description)

### Usage

**Get all products:**
```tsx
import { productList } from "@/lib/products";

// Array of all products
productList.forEach(product => {
  console.log(product.name);
});
```

**Get product by ID:**
```tsx
import { getProductById } from "@/lib/products";

const travel = getProductById("travel");
console.log(travel?.tagline);
```

**Filter by category:**
```tsx
import { getProductsByCategory } from "@/lib/products";

const primaryProducts = getProductsByCategory("primary");
// Returns: Global Accounts, Payouts, Travel
```

### Content Guidelines

**100% Original** ✅
All content is original and fintech-inspired but not copied from:
- Airwallex
- Nium
- Stripe
- Wise
- Any competitor

**Tone:**
- Professional SaaS
- Concise and clear
- Premium positioning
- No marketing fluff

**Examples:**
✅ "Hold and manage money in 50+ currencies"
❌ "Revolutionary currency management" (too fluffy)

✅ "Execute cross-border payments in seconds"
❌ "Lightning-fast global transfers" (too marketing-speak)

### Product IDs

```
global-accounts
cards
payouts
fx
travel
api
```

Use these IDs in routes: `/products/{id}`

### Icons

All icons from `lucide-react`:
- Globe (Global Accounts)
- CreditCard (Cards)
- Zap (Payouts)
- TrendingUp (FX)
- Plane (Travel)
- Code (API)

### Color Mapping

**Primary Products** (Green):
- Global Accounts
- Payouts
- Travel

**Accent Products** (Purple):
- Cards
- FX & Treasury
- Developer APIs

### Extending Products

**Add a new product:**
```tsx
export const products: Record<string, Product> = {
  // ... existing products

  "new-product": {
    id: "new-product",
    name: "New Product",
    tagline: "Your tagline here",
    description: "Full description...",
    icon: YourIcon,
    color: "primary",
    href: "/products/new-product",
    features: [
      "Feature 1",
      "Feature 2",
      // ...
    ],
    useCases: [
      {
        title: "Use Case 1",
        description: "Description...",
        benefits: [
          "Benefit 1",
          "Benefit 2",
          "Benefit 3",
        ],
      },
      // Add 2-3 use cases
    ],
    stats: [
      {
        label: "Metric",
        value: "Value",
        description: "Context",
      },
    ],
  },
};
```

### Data Quality Checklist

Before adding content:
- [ ] Is the content 100% original?
- [ ] Is the tone professional and concise?
- [ ] Are there 3 use cases per product?
- [ ] Are there 3 benefits per use case?
- [ ] Are stats included (optional but recommended)?
- [ ] Does the icon match the product?
- [ ] Is the color assignment appropriate?
- [ ] Does the URL match the product ID?

### Type Safety

All product data is fully typed:
```tsx
import type { Product, UseCase, ProductStat } from "@/lib/products";

const product: Product = {
  // TypeScript ensures all required fields
};
```

### Common Patterns

**Display product in card:**
```tsx
const product = getProductById("travel");
const Icon = product.icon;

<Card>
  <Icon className="h-6 w-6" />
  <h3>{product.name}</h3>
  <p>{product.tagline}</p>
</Card>
```

**Render features:**
```tsx
{product.features.map((feature, i) => (
  <li key={i}>{feature}</li>
))}
```

**Render use cases:**
```tsx
{product.useCases.map((useCase, i) => (
  <div key={i}>
    <h4>{useCase.title}</h4>
    <p>{useCase.description}</p>
    <ul>
      {useCase.benefits.map((benefit, j) => (
        <li key={j}>{benefit}</li>
      ))}
    </ul>
  </div>
))}
```

---

**Remember:** All content must remain original and comply with CLAUDE.md guidelines. Never copy from competitors.
