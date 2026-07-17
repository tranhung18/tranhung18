---
title: Portfolio V2 - Bento Console
date: 2026-07-16
type: decision
source: implementation on branch feature/v2-bento-design
tags: [portfolio, frontend, threejs, a11y, performance]
---

# V2 — Bento Console

Second design version of the portfolio. **V2 is now the default homepage**,
served at `index.html`; V1 lives at `v1.html`. Switchable via a persisted
toggle in the navbar (`js/version-toggle.js`, `localStorage["portfolio-version"]`).
`v2.html` still exists as a redirect stub to `index.html` for old bookmarks/links.

## Files added

| File | Purpose |
|---|---|
| `data.js` | ES module, single source of truth for profile/nav/hero/about/skills/projects/experience/contact/footer/typing phrases. |
| `index.html` | V2 markup skeleton (mostly empty containers - content is rendered by `v2.js`). This is now the homepage. |
| `v2.css` | V2's own design system (tokens, bento grid, dock nav, components). Zero shared selectors with `style.css`. |
| `v2.js` | Renders every section from `data.js`, wires language/version toggles, scroll reveal, skill filtering, lazy-boots the 3D hero tile. |
| `js/v2-three-scene.js` | Dynamically imported Three.js scenes for tile-scoped 3D (hero shapes, Contact particle field, About orb accent). |
| `js/v2-snake-bg.js` | Dynamically imported Three.js scene for the full-page ambient "tech snake" background. |
| `js/version-toggle.js` | Shared by both `index.html` (V2) and `v1.html` - persists/reads `portfolio-version`. |
| `v1.html` | V1's original markup, unchanged content, moved here from `index.html`. |
| `v2.html` | Thin redirect stub to `index.html`, kept for backward-compatible links. |

Files touched in V1 (additive only, see "V1 compromise" below): `v1.html`
(formerly `index.html`), `css/style.css`, `js/main.js`.

## Why Bento grid (not Terminal/IDE or horizontal scroll)

The brief offered three directions. Bento was chosen over:

- **Terminal/IDE UI** - a fake command parser (`help`, `about`, `skills`)
  and syntax-highlighted content panes are a lot of extra surface area
  (parsing, autocomplete, history) for a portfolio that recruiters skim in
  under a minute. Rendering project bullet points "as code" also hurts
  scannability for non-technical readers.
- **Horizontal scroll storytelling** - harder to get right on keyboard
  navigation and at 375px width without extra JS to remap scroll axes;
  higher risk against the acceptance checklist (a11y, mobile, CPU budget)
  given the single implementation pass available here.

Bento grid gives a structure that reads as "different system" the instant
it loads (asymmetric tiles vs. V1's centered 2-column hero), while staying
CSS-Grid-only (no JS layout engine), which keeps it robust across
375px–1920px and easy to keyboard-navigate (each tile is a normal
document-flow block, not an absolutely-positioned canvas layout).

The grid is applied to **every** section, not just the hero, so the
"different design system" feeling holds all the way down the page:
hero tiles, about tiles, skill tiles, project tiles, and a contact tile
grid. Experience deliberately breaks from V1's alternating left/right
timeline and uses a single vertical stack of cards instead - a genuinely
different structure, not just a reskin.

## Design system delta vs. V1

| | V1 | V2 |
|---|---|---|
| Base | near-black + single teal hue | deep graphite/navy + violet→cyan + amber accent |
| Headings | Space Grotesk | JetBrains Mono (reads as "code editor") |
| Hero | 2-column (text / avatar card) | bento grid: intro + 3D tile only (stats/tech-glance/featured-project/contact tiles were dropped from the hero row - that content already lives in the About/Skills/Projects/Contact sections below, so keeping it in the hero too was pure duplication) |
| Nav | floating pill, centered | sticky top "dock" bar with traffic-light dots |
| Experience | alternating left/right timeline | vertical stacked cards |

Both fonts are the same self-hosted families already loaded by
`css/fonts.css` (Space Grotesk / Plus Jakarta Sans / JetBrains Mono), so V2
adds zero new font requests.

## 3D perf strategy

`js/v2-three-scene.js` exports three tile-scoped scenes, all booted through
one shared lazy-loader, `initLazy3D()` (v2.js), so they follow an identical
perf/safety contract instead of each re-implementing it. (The full-page
snake background is a fourth, separate scene with its own loader - see
"Tech snake background" below, since a fixed full-viewport layer doesn't
fit the same "is this tile in view" gating.)

- **`createTechShapesScene`** (hero `tech://render` tile) - a cluster of
  low-poly wireframe shapes (icosahedron/octahedron/tetrahedron/torus/
  dodecahedron, `MeshBasicMaterial({wireframe:true})`) that tilt toward the
  pointer, spin individually, and drift vertically in sync with page scroll
  (a sine curve so it eases back to center at both ends of the page instead
  of drifting off-canvas).
- **`createParticleFieldScene`** (Contact section's lead tile,
  `#contact-3d-tile`) - a sparse ambient point cloud behind the CTA text,
  low-opacity (`.tile-3d-backdrop`, `opacity: 0.6`) and passive (no pointer
  tracking - it sits behind real content, so a busy/reactive backdrop would
  compete with the CTA rather than support it). Just a slow ambient
  rotation.
- **`createOrbAccentScene`** (About section's avatar tile, `#about-3d-tile`)
  - a small wireframe icosahedron + a thin torus "ring" rotating slowly
  behind the initials. Rendered in white/near-white rather than the
  violet/cyan accent colors, because this tile already has a solid
  `--grad-primary` fill - colored wireframe would just blend into the
  gradient it sits on, white reads as an engraved pattern instead (an even
  subtler `opacity: 0.35` override on `.tile-3d-backdrop` for this tile
  specifically, vs. the 0.6 default).

Perf/safety rules, all enforced once in `initLazy3D()` plus per-scene
cleanup in the scene module itself:

- **Pinned version**: `three@0.160.0`, loaded via `<script type="importmap">`
  pointing at `https://unpkg.com/three@0.160.0/build/three.module.js`. The
  importmap itself costs nothing until something actually does
  `import 'three'`.
- **Lazy**: the module (and therefore `three`) is only `import()`-ed once
  an `IntersectionObserver` reports a given tile is near the viewport.
  Before that, each tile's own static CSS fallback (`.hero-3d-fallback` /
  `.tile-3d-backdrop-fallback`) is shown.
- **`prefers-reduced-motion: reduce`**: `initLazy3D()` returns immediately
  for every scene, the observer is never attached, `three` is never
  fetched, the fallback stays forever.
- **Viewport < 768px**: same early return via
  `matchMedia('(max-width: 767px)')` checked once before attaching the
  observer - no canvas element, no network request, mobile never pays for
  either scene.
- **Pause when hidden**: the same `IntersectionObserver` toggles
  `pause()/resume()` once a scene is live (tile scrolled out = paused);
  a shared `visibilitychange` listener does the same for backgrounded tabs.
  `pause()` just skips the render call inside the existing rAF loop
  (loop keeps ticking at near-zero cost rather than being torn down/rebuilt
  each time, which is cheaper than repeatedly cancelling/re-requesting rAF).
- **Dispose**: `dispose()` cancels the rAF, removes that scene's listeners
  (`mousemove`/`scroll` for the hero scene; `resize`/`ResizeObserver` for
  both), disposes every geometry and material, disposes the renderer, and
  removes the canvas node. Wired to `pagehide` (defensive - browsers already
  free the GL context on navigation, but this also lets a future SPA-style
  teardown call it directly).
- Shape/point count adapts to tile width: the hero scene runs 5 shapes
  under 500px-wide tiles / 8 above (5 distinct geometries now instead of 3,
  so the extra torus/dodecahedron variety actually gets to appear); the
  contact backdrop runs 60 points under 700px / 110 above (it spans the
  full 12-column row, so it's much wider than the hero tile). Both
  renderers are capped at `devicePixelRatio` 2.

## Tilt/parallax (non-3D tiles)

Every other bento tile (About/Skills/Projects/Contact - anything that isn't
the hero's WebGL tile) gets a lightweight pointer-tracked tilt:
`initTiltTiles()` (v2.js) sets `--tilt-x`/`--tilt-y`/`--tilt-lift` CSS custom
properties on `pointermove`/`pointerleave`, consumed by a single `transform:
perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))
translateY(var(--tilt-lift))` declared on `.bento-tile` in v2.css. No
canvas, no Three.js - just a CSS transform, so it's effectively free next to
the WebGL tiles. Skipped entirely when `prefers-reduced-motion: reduce` or
`(pointer: fine)` doesn't match (touch has no pointermove stream to drive
it from), and the hero's `.hero-tile-3d` tile is excluded so its own
WebGL-driven parallax doesn't fight a second, independent tilt on the outer
wrapper.

## Tech snake background

A fourth 3D piece, added after feedback that the two original tile-scoped
scenes (hero + Contact) read as too sparse for a "3D-forward" portfolio.
`js/v2-snake-bg.js` renders a full-page ambient wireframe "snake" that sits
behind every section for the whole session.

**Reference/research** - the user pointed at ALEX BENDER's "Argus VPN"
landing page ([Behance](https://www.behance.net/gallery/204512905/Argus-VPN-UXUI-website-design-and-3D-animation),
[FANCY](https://fancy.design/works/argus-vpn.html)) as a style reference:
glossy, shaded 3D hero objects on a dark violet (`#2C33FF`-ish) background.
That specific glossy/shaded look was **not** carried over - see "why
wireframe, not glossy" below. Separately, a Codrops article,
["Building an Endless Procedural Snake with Three.js and WebGL"](https://tympanus.net/codrops/2026/02/10/building-an-endless-procedural-snake-with-three-js-and-webgl/)
(Feb 2026), describes the general technique this is based on: a snake
built from a trailing point history fed into a spline, chasing the
pointer. The mouse-chase behavior from that article was deliberately
softened - see "why ambient wander, not mouse-chase" below. No code was
copied from either source; both were used as direction-setting references
only, confirmed with the user via two multiple-choice questions before
implementation (style: wireframe vs. glossy vs. blocky-robot; behavior:
ambient-wander vs. mouse-chase).

**Technique** (`createSnakeBackground()`):
1. Keep a fixed-length (`TRAIL_LENGTH = 40`) array of `THREE.Vector3` head
   positions.
2. Feed it into `THREE.CatmullRomCurve3` → `THREE.TubeGeometry`, **rebuilt
   every frame**. This sounds wasteful but isn't: `TUBULAR_SEGMENTS` (64)
   and `RADIAL_SEGMENTS` (6) are constants, so vertex count never changes
   (~450 vertices) - recreating the geometry is simpler than mutating
   `TubeGeometry`'s internal buffers in place and costs about the same.
3. The head's target position comes from cheap layered-sine "noise"
   (`wanderNoise()` - three sine waves at irrational-ish frequency ratios,
   no external noise library, ~5 lines) blended with a soft pull toward the
   pointer (`pointerPull = 0.22` once the pointer has moved at all).
4. Vertex colors lerp violet (`--primary`, tail) → cyan (`--primary-2`,
   head) using the tube's own U coordinate (`geometry.attributes.uv`), no
   texture/shader needed.

**Why wireframe, not glossy** (deviates from the Argus reference on
purpose): every other 3D element in V2 is `MeshBasicMaterial({wireframe:
true})` - no lights, no shading, no reflections. A glossy/shaded snake
would need a light rig + PBR-ish material and would be the only shaded
object on a page of wireframes, breaking visual consistency. More
importantly, this snake **runs continuously for the entire session**
(unlike the tile scenes, which pause when scrolled out of view) - the
existing wireframe/`MeshBasicMaterial` approach is already the cheapest
rendering path available, and this is the one scene where "cheapest" isn't
optional, since there's no viewport-based pause to fall back on.

**Why ambient wander, not mouse-chase** (deviates from the Codrops
reference on purpose): a snake that visibly chases the cursor works well
in the article's demo (a contained canvas you're actively looking at), but
this one is a full-page, always-present backdrop behind five sections of
real content - a hard chase across the *entire* browser window is more
likely to be distracting than delightful, and it means recomputing more
aggressively every time the pointer moves anywhere on the page. Blending in
just enough pointer pull (0.22) so the snake *feels* aware of the cursor
without being driven by it keeps it in "ambient" territory.

**Perf gates**, layered on top of everything `initLazy3D()` already does
for the tile scenes:
- **Not IntersectionObserver-gated** - a `position: fixed` full-viewport
  layer is definitionally always "in view", so there's no tile to observe.
- **Deferred past `load`**: `initSnakeBackground()` (v2.js) waits for the
  `load` event, then a `requestIdleCallback` (falling back to
  `setTimeout(fn, 300)` where unsupported), before dynamically importing
  `v2-snake-bg.js`. This keeps it from ever competing with first paint/LCP
  for the actual portfolio content.
- **`prefers-reduced-motion: reduce` / viewport < 768px**: skipped
  entirely, same as the tile scenes - and unlike the tile scenes, **no
  fallback is shown**, because there's nothing that needs filling; it's
  pure background decoration, so absence is a perfectly fine state.
- **Pause/dispose**: same `visibilitychange` pause/resume and `pagehide`
  dispose pattern as the tile scenes.
- **Layering**: `.snake-bg-wrap` is `position: fixed; z-index: -1;
  pointer-events: none`, placed as the first child of `<body>`. A negative
  z-index puts it above the plain page background (`body.v2-body`'s
  gradient) but below every real section/tile (all `z-index: auto` in
  normal flow) - so the snake is visible in the gaps between tiles and
  disappears behind opaque tile surfaces, never covering text or
  intercepting clicks.

## Bug fix: snake background was invisible

Shipped initially with `.snake-bg-wrap { z-index: -1; }`, expecting that to
sit "above the flat page background, below real content" for free. It
didn't - `body.v2-body` has its own `background`/`background-image` (the
two radial gradients), and because `body` is a plain non-positioned box,
that background paints as an ordinary in-flow descendant of the root
stacking context, ahead of negative-z-index descendants being composited
on top. Net effect: the canvas was rendering (no JS error, no missing
import), just permanently hidden behind `body`'s own opaque background at
every scroll position - which is exactly what "hiệu ứng con rắn vẫn chưa
hoạt động" looked like from the outside.

**Fix**: `.snake-bg-wrap` now uses `z-index: 0` (not negative), which
paints it in the "positioned, z-index:auto/0" step - after body's own
background, so it's visible against the flat gradients. To keep real
content unambiguously above the canvas (not the other way around),
`#main-content` and `.v2-footer` are explicitly promoted to `position:
relative; z-index: 1` (`.dock` already had `z-index: 200`). Explicit
z-index on both sides removes any dependence on paint-order technicalities
that got this wrong the first time.

Also bumped `TUBE_RADIUS` (9 → 15) and `RADIAL_SEGMENTS` (6 → 8): even
once actually visible, a 9-unit-radius tube against a ~200-400 world-unit
viewport read as a near-invisible hairline. `opacity` also raised
0.5 → 0.65.

## Curated micro-interactions (animista.net / reactbits.dev inspired)

After the snake fix, added three more small, vanilla-CSS/JS touches based
on categories of effects common on [animista.net](https://animista.net/)
(FreeBSD-licensed CSS keyframe library) and
[reactbits.dev](https://reactbits.dev/) (open-source **React** component
gallery). Neither was pulled in as a dependency or had its code copied -
React Bits' components are React-specific and can't be dropped into a
vanilla-JS site as-is, and Animista's animations, while free to reuse
verbatim, are generic enough (fade/scale/shine patterns) that writing them
by hand kept them consistent with this file's existing token/naming
conventions instead of introducing a second style. [swishy.ai](https://www.swishy.ai/)
was also reviewed - it's an AI *video/motion-graphics generator* (exports
video/Lottie-style output for social content), not a source of web
CSS/JS, so nothing from it applies here.

- **Gradient shine sweep** (`.gradient-text`) - the hero name's gradient
  fill now has a bright mid-stop and animates `background-position` on a
  6s loop, instead of being a static two-color fill. Pure CSS
  (`background-size` + `@keyframes gradientShine`), no JS.
- **Spotlight cursor-glow buttons** (`.btn-v2::before`) - a radial gradient
  positioned at `--spot-x`/`--spot-y`, set by `initSpotlightButtons()`
  (v2.js) on `pointermove`, fades in on `:hover`/`:focus-visible`. Same
  `pointer: fine` + reduced-motion guard as `initTiltTiles()`; `::before`
  paints above the button's own background but below its text for free
  (generated content is inserted before the element's other children).
- **`.reveal-scale`** - a second scroll-entrance variant ("scale-up-center"
  in Animista's naming) alongside the existing `.reveal-up` fade, reusing
  the *same* `IntersectionObserver` in `initScrollReveal()` (just toggles
  `.is-visible` on either class - the transform difference lives entirely
  in CSS). Applied to the five section-title `<h2>`s in `index.html` (V2),
  purely additive since those headings previously had no entrance animation.

**Considered, not added** (to keep this pass scoped and avoid turning a
portfolio into a WebGL/animation showcase that's slower than it needs to
be): a horizontal marquee/logo-loop for tech icons, and per-letter
split-text reveals for headings - both are common React Bits categories
but are more visually loud and a larger implementation surface (marquee
needs duplicated content + careful `will-change`/reduced-motion handling;
split-text needs per-character DOM nodes, which affects screen-reader
text). Flagging as options if you want another visual pass rather than
silently skipping them.

## V1-ported skill-tile brand glow + prominent chip/tile hover

Two follow-up requests after a visual pass on the Skills/About/Projects/
Contact sections: port V1's per-tech hover glow to V2's skill tiles
(V2's plain border/background hover read as flat next to V1's colored
glow), and make chip- and tile-style hover states ("nổi bật hơn") do more
than swap a text color.

**Skill tiles (`.skill-tile`, `v2.css` + `v2.js`)** - V1's `.skill-card`
(`css/style.css`) tints on hover using a per-card `--brand-color`, set via
`[data-color="x"]` attribute selectors mapped against ~17 hardcoded root
`--color-x: r, g, b` variables. V2 doesn't have (and shouldn't gain) that
parallel table, since every skill already lives in `data.js` with an
`iconColor` hex used for its `simpleicons.org` CDN icon. So the same
end-result is produced without duplicating data:

- `skillBrandRgb(skill)` (`v2.js`) resolves an `"r, g, b"` string per
  skill, in priority order: its own `iconColor` hex (via `hexToRgb()`),
  then a small `NAMED_COLOR_RGB` map carrying over V1's `--color-cicd` /
  `--color-postman` values for the two skills that use a Phosphor icon
  instead of a colored CDN icon (`devops-tools`, `ai-productivity` -
  these have no `iconColor` in `data.js`), then `--primary` violet as a
  last-resort default so nothing renders with an undefined custom
  property.
- `renderSkills()` sets the result inline as `style="--brand-rgb: r, g, b"`
  on each `.skill-tile`, so `v2.css` never needs a per-skill selector -
  adding a new skill to `data.js` is enough, no matching CSS edit.
- `v2.css`: `.skill-tile::before` is a `radial-gradient(circle at top
  right, rgba(var(--brand-rgb), 0.16) ...)` overlay that fades in on
  `:hover` (`.bento-tile` already provides `position: relative; overflow:
  hidden`, so this needed no extra positioning setup); `:hover` also tints
  `border-color`/`box-shadow` with the same `--brand-rgb` and scales +
  lifts the icon, tinting Phosphor icons (`i`) to the brand color directly
  (CDN `<img>` icons keep their own baked-in color, since an `<img>`
  can't be recolored with CSS `color`).

**Prominent hover on chips/tags/contact tiles** - previously these only
swapped `color`/`border-color` on `:hover`, which read as barely different
from resting state next to the new skill-tile glow. Brought
`.strength-chip`, `.project-tag-chip`, `.skill-filter-btn`, and
`.contact-item-tile` up to the same "lift + scale + colored glow shadow"
language:

- `.strength-chip:hover` / `.project-tag-chip:hover` -
  `translateY(-2px/-3px) scale(1.05/1.06)` + a soft colored `box-shadow`
  (cyan for strengths, violet for tags) + background/border/color swap.
- `.skill-filter-btn:hover` - split out from `.active` (previously the
  same rule handled both, so hovering an already-active filter did
  nothing extra); `:hover` now adds a lift + violet glow on top of the
  active-style background regardless of active state.
- `.contact-item-tile:hover` - border + cyan `box-shadow` on the whole
  tile, plus `scale(1.18) translateY(-2px)` on the icon specifically (the
  link's own `color` swap on hover is unchanged/kept).
- Reduced-motion block: `transition: none` extended to cover all of the
  above selectors (plus `.skill-tile::before`) so `prefers-reduced-motion`
  still fully disables the new hover motion, not just the pre-existing
  ones.

All of the above are pure CSS `:hover`/`::before` plus one inline custom
property set at render time - no new JS listeners, no runtime cost added
to `initTiltTiles()`/`initSpotlightButtons()`.

## Anti-flash redirect

Both `index.html` (V2) and `v1.html` start `<head>` with the same inline,
synchronous script (before any `<link>`/`<script>`):

```js
var saved = localStorage.getItem('portfolio-version');
var isV1 = location.pathname.endsWith('v1.html');
if (saved === 'v1' && !isV1) location.replace('v1.html');
else if (saved === 'v2' && isV1) location.replace('index.html');
```

`location.replace()` is used specifically so the redirect doesn't add a
history entry - landing on the "wrong" page and bouncing to the right one
is invisible in the back/forward stack. First-ever visit (no saved
preference) never redirects, so the default homepage (`index.html`, V2) is
what a new visitor sees - this is what makes V2 the default layout.

Clicking the V1/V2 toggle (`js/version-toggle.js`) is a normal navigation
(does add a history entry), so pressing Back after switching will return to
the previous page, whose own anti-flash script will then bounce forward
again to the persisted version - one redirect, not a loop, but Back does
not "undo" a persisted preference. That's the intended behavior for a
persisted setting (same pattern as a dark-mode toggle), not a bug.

Language (`portfolio-lang`) and version (`portfolio-version`) are separate
localStorage keys - switching one never touches the other.

## The V1-vs-data.js contradiction (read this before assuming both are 100% wired)

The brief states two things that directly conflict if taken literally:

1. "V1 giữ nguyên tại `index.html`... KHÔNG đổi bất kỳ hành vi/markup nào
   của V1." (quoting the original brief - V1 has since moved to `v1.html`
   when V2 became the default homepage; the constraint itself still applies.)
2. "Sửa 1 dòng trong `data.js` phải đổi cả 2 version."

You can't have a single source of truth driving V1's markup *and* leave
V1's markup completely untouched - hydrating V1 from `data.js` requires at
minimum adding `<script type="module">`/data attributes, which is itself a
markup change, and if done for every field (nav, hero, 17 skill cards, 4
projects with 5-6 bullets each, 3 experience entries) turns into ~100+
attribute wire-ups and DOM-generation logic for arrays (highlights, tags,
timeline bullets) - real risk of shifting element counts/order in V1's
existing DOM, i.e. exactly the kind of "markup/behavior change" rule #1
forbids.

Resolution taken here, prioritizing rule #1 (explicitly called out first,
worded as a hard constraint) over rule #2 for the *bulk* of V1's content:

- **V2 is 100% data-driven.** Every section in `index.html` (V2) is rendered
  from `data.js` at runtime - there is no hardcoded profile/project/skill/
  experience content anywhere in `index.html` or `v2.js`. Editing `data.js`
  always updates V2.
- **V1 stays hardcoded**, exactly as it was, for nav labels, hero copy,
  about text, skill cards, project cards, experience/timeline, and contact
  info. `data.js` was populated by transcribing V1's current content
  verbatim, so the two start perfectly in sync - but editing `data.js`
  later will **not** propagate to those parts of V1.
- **One exception, done because the risk was genuinely low**: the hero
  typing phrases. `js/main.js`'s script tag became `type="module"` and it
  now does `import { typingPhrases } from '../data.js'` instead of holding
  its own local arrays. This is a single, isolated value swap with no DOM
  structure implications, so it was safe to wire for real - it's the one
  place where "sửa data.js đổi cả 2 version" is literally true today.

If you want V1 fully hydrated from `data.js` too, that's a separate,
larger follow-up (add `data-key` attributes across `v1.html`, a
hydration pass in `main.js` that only ever overwrites text nodes with
identical values so there's no visible flash, and care around the
highlight/tag/timeline arrays so DOM node counts never drift from what's
authored). Flagging this now rather than quietly shipping a
partially-met acceptance box.

## A11y notes / fixes made during self-review

- Two color combinations initially failed WCAG AA and were corrected
  before shipping: `--text-muted` (`#5b6577` → `#7b8698`, ~3.3:1 → ~5.25:1
  on `--bg`) and the two spots that painted white text on the
  violet→cyan gradient (`.btn-v2-primary`, `.skill-filter-btn.active`) -
  the cyan end of that gradient only gave white text ~2.1:1. Both now use
  a dedicated solid `--fill-solid` (`#6a45f0`, ~5.6:1 with white text)
  instead of the gradient. Same fix applied to `.skip-link`.
- `prefers-reduced-motion: reduce` disables the typing effect (shows the
  first phrase statically), the pulse dot / caret blink, tile hover
  lift transitions, and scroll-reveal animation (content is shown at full
  opacity immediately instead of animating in).
- All interactive elements (`version-btn`, `lang-btn`, `dock-link`,
  `skill-filter-btn`, `dock-menu-toggle`) are real `<button>`/`<a>`
  elements, so they're keyboard-reachable and activatable by default; a
  visible `:focus-visible` ring (2px, `--primary-2`) is defined once at
  the top of `v2.css` and applies globally.
- Version/language toggles use `aria-pressed`, the mobile menu button uses
  `aria-expanded`/`aria-controls`, and all icon-only/decorative elements
  that aren't meaningful to screen readers are marked `aria-hidden`.
- The mobile nav overlay does **not** trap focus (per the acceptance
  checklist), but content behind it is marked `inert` while it's open, so
  Tab can't silently walk into links hidden behind the overlay - that's a
  different thing from trapping (you can still Tab/Shift+Tab freely
  within what's visible; you just can't reach what's invisible). Escape
  also closes it.
- Skip-link (`Skip to content`) is the first focusable element on the
  page.

## What wasn't verified in this environment (and why)

The sandbox this was built in has no GUI and its outbound network is
allowlisted - `npx playwright install` failed with `403 Connection blocked
by network allowlist`, so no headless Chromium was available to render the
page or capture screenshots. Everything below was checked statically
instead (all passed): HTML tag-balance + duplicate-id check via Python's
`html.parser`, CSS brace-balance count, `node --check` on every `.js` file,
and a manual re-derivation of the WCAG contrast ratios listed above.

**Not verified**: actual rendered screenshots (desktop/mobile), real
Lighthouse score for V1 (to confirm it's unchanged), DevTools 4x-CPU
throttle scroll smoothness, and the Network-tab check that `three.js`
never loads on mobile/reduced-motion. These need a real browser - open
`index.html` through a local server (e.g. `npx serve` or the VS Code Live
Server extension) and walk the acceptance checklist by hand, or ask me to
drive it through the Chrome extension / your desktop if you'd like that
done interactively.
