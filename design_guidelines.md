# Design Guidelines: Minimal Next.js Scaffold

## Design Approach
**Utility-Focused System Approach**: Given the blank scaffold nature, we'll use a minimal design system that provides structure without imposing aesthetic constraints.

**Foundation**: Tailwind CSS with default configuration - extensible base for future customization.

## Core Design Elements

### Typography
- **Font Stack**: System fonts for zero latency
  - `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Scale**: Tailwind's default type scale (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Layout System
- **Spacing Units**: Standardize on Tailwind units of **2, 4, 8, 12, 16** for consistency
  - Micro spacing: `gap-2`, `p-2`
  - Component spacing: `p-4`, `gap-4`, `m-4`
  - Section spacing: `p-8`, `py-12`, `gap-8`
  - Major sections: `py-16`
- **Container**: `max-w-7xl mx-auto px-4`
- **Grid**: CSS Grid and Flexbox - responsive by default

### Component Library

**Navigation**
- Simple top nav with logo left, links right
- Mobile: Hamburger menu (flex md:hidden pattern)
- Structure: `<nav className="border-b">` with container inside

**Buttons**
- Primary: `px-4 py-2 rounded font-medium`
- Ghost/Secondary: Border variant
- States: Built-in via Tailwind (hover:, focus:, active:)

**Forms**
- Input: `border rounded px-3 py-2 w-full`
- Label: `block text-sm font-medium mb-1`
- Consistent spacing: `space-y-4` for form groups

**Cards**
- Base: `border rounded-lg p-6`
- Hover: `hover:shadow-lg transition-shadow`

**Layout Sections**
- Simple page structure: Header, Main (min-h-screen), Footer
- Main content: `py-8 md:py-12`

### Minimal Landing Structure (If Needed)
- **Hero**: Clean, centered content with title, description, CTA
  - No large imagery unless specifically added later
  - Simple gradient background option: `bg-gradient-to-br from-gray-50 to-gray-100`
- **Content Area**: Single column, max-w-prose for readability
- **Footer**: Minimal - copyright and essential links only

### Animations
**None by default** - Add purposefully only when needed

### Accessibility
- Semantic HTML5 elements
- ARIA labels where needed
- Focus states visible: `focus:ring-2 focus:ring-offset-2`
- Color contrast: Ensure text meets WCAG AA standards

### Visual Treatment
- **Borders**: Use subtle borders (`border-gray-200`) for structure
- **Shadows**: Minimal use - `shadow-sm` for elevation hints only
- **Rounding**: Consistent `rounded-lg` (8px) for components
- **Whitespace**: Generous - let components breathe

## Images
**No hero images by default** for this scaffold. Add images later based on actual content needs.

## Key Principle
This is a **foundation**, not a final design. Provide clean structure, maintain consistency in spacing/typography, and allow easy extension without fighting against early design decisions.