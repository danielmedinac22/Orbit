# Design System Specification: The Cosmic Aperture

## 1. Overview & Creative North Star
**Creative North Star: The Celestial Cockpit**
This design system moves beyond the standard dashboard "box-model" to create a high-end, editorial experience inspired by precision aerospace instrumentation. We treat the interface not as a flat webpage, but as a multi-layered viewport into complex data.

By prioritizing **Intentional Asymmetry** and **Tonal Depth**, we break the "template" look. We avoid generic grids in favor of a "weighted" layout where information density is balanced by expansive negative space. The goal is a signature visual identity that feels like a bespoke tool for a specialized operator—professional, silent, and immensely powerful.

---

## 2. Colors & Surface Architecture
The palette is a sophisticated range of deep space blues and cold cyans. The primary objective is to create "Atmospheric Depth" through color alone.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for defining primary layout sections. Structure must be achieved through **Background Color Shifting**. For example:
*   Use `surface_container_low` (#181b27) for the main workspace.
*   Use `surface_container_lowest` (#0b0e19) for the global navigation or "the void" behind the content.
*   Separation is felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers floating in a vacuum.
*   **Level 0 (The Void):** `surface_dim` (#10131e) — Use for the furthest background layer.
*   **Level 1 (The Deck):** `surface_container` (#1c1f2b) — The base for primary content areas.
*   **Level 2 (The Instrument):** `surface_container_high` (#272935) — For cards and active components.
*   **Level 3 (The Focus):** `surface_container_highest` (#313441) — Reserved for hover states or elements requiring immediate user attention.

### The "Glass & Gradient" Rule
To achieve a "Signature" feel, secondary floating elements (modals, popovers) should utilize **Glassmorphism**. Use semi-transparent variants of `surface_bright` with a `backdrop-blur` of 12px to 20px. 
**Signature Texture:** Main Action buttons must use a subtle linear gradient: `primary` (#8aebff) to `primary_container` (#22d3ee) at a 135-degree angle. This provides a "lit from within" glow that flat colors cannot replicate.

---

## 3. Typography
The typographic identity is built on a high-contrast pairing: the humanistic clarity of **Inter** and the technical precision of **JetBrains Mono**.

*   **Editorial Scale:** Use `display-lg` (3.5rem) sparingly for high-impact data points or welcome headers. The contrast between a massive display number and `label-sm` technical metadata creates a sophisticated, "NASA-spec" aesthetic.
*   **The Technical Readout:** All data values, timestamps, and coordinates must be set in **JetBrains Mono**. This reinforces the "Information-Dense" brand personality.
*   **Visual Hierarchy:** 
    *   **Headlines:** Inter, 650 weight. Use `headline-sm` for card titles to maintain a compact, professional footprint.
    *   **Body:** Inter, `body-sm` (0.85rem). Standardize on `on_surface_variant` (#bbc9cd) to reduce eye strain in high-density views.

---

## 4. Elevation & Depth
Depth in this system is a product of light and layering, not structural scaffolding.

### The Layering Principle
Achieve lift by stacking tokens. A `surface_container_highest` card sitting on a `surface_container_low` background creates a natural, soft elevation. No shadows are required for standard layout components.

### Ambient Shadows & Glows
When an element must "float" (e.g., a dragged card or an active modal), use **Ambient Shadows**:
*   **Color:** Use a tinted version of the accent: `rgba(34, 211, 238, 0.06)`.
*   **Style:** Extra-diffused. `0px 20px 40px rgba(0, 0, 0, 0.4)` combined with the cyan hover glow `0 0 20px rgba(34, 211, 238, 0.06)`.

### The Ghost Border
If accessibility requirements demand a border, use a **Ghost Border**. Use `outline_variant` (#3c494c) at **10% opacity**. It should be nearly invisible, appearing only as a slight "catch-light" on the edge of the surface. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Text: `on_primary`. Radius: `10px`.
*   **Secondary:** Ghost Border style. Background: `transparent`. Text: `primary`.
*   **Tertiary/Icon:** No background. Text: `Text Muted`. On hover, shift background to `surface_container_highest`.

### Input Fields
*   **Visuals:** Use `surface_container_low` background with a JetBrains Mono typeface for the input value.
*   **State:** On focus, the border transitions from 10% opacity to a `primary_fixed_dim` (#2fd9f4) glow at 30% opacity.

### Cards & Lists
*   **The "No-Divider" Rule:** Vertical white space (28px) or subtle tonal shifts between `surface_container` tiers must replace all line dividers. 
*   **Data Density:** Use `label-sm` (JetBrains Mono) for secondary metadata inside lists to maintain a high-tech "terminal" feel.

### Additional Component: The "Status Orbit"
For status indicators, do not use simple circles. Use a 2px "ring" of the status color (e.g., `Danger #f87171`) surrounding a 4px solid core. This mimics planetary orbits and aligns with the space-inspired brand.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use JetBrains Mono for any number that changes frequently (price, latency, counts).
*   **Do** embrace asymmetry. If a dashboard has three columns, make one significantly wider than the others to create an editorial feel.
*   **Do** use `Text Muted` (#6b7a90) for labels to allow the `Text Primary` data to "pop" off the screen.

### Don't:
*   **Don't** use pure black (#000000). Always use the `surface_dim` or `surface_container_lowest` for the deepest blacks.
*   **Don't** use 1px solid white or grey lines to separate content. It breaks the "floating in space" illusion.
*   **Don't** use standard "Drop Shadows." Use the Ambient Glow approach with cyan tints.
*   **Don't** crowd the edges. Use the 28px content padding religiously to provide the "breathing room" required for a premium experience.