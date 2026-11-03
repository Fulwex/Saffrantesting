# About / partners separation: five concepts

## Current revision: white About / navy gradient partners

User explicitly requested a return to white About and blue partners, with background design on the latter. About is now `#fbfaf7` with no decorative background wash. The partner gallery uses only the established deep navy shades `#111b34`, `#21385e`, `#192844`, a restrained gold radial edge light, and a very faint broad gold reflection. Partner text is ivory/gold with readable pale locations. Card layout, source photographs, fonts and continuous opposing tracks are preserved. No black, pale blue, thick frames, pills, number badges or background animation. Contrast tests use a conservative upper brightness bound for the composited gallery background; actual browser rendering remains unverified.

## Superseded revision: warm brand-gold / ivory fold-light

The user rejected the blue-gray palette as inconsistent with SAFFRAN. All cool pastel colors and hard diagonal planes were removed from the About backdrop. The replacement uses muted sand/champagne values derived from the existing gold and ivory: `#dfcfaf`, `#dac7a4`, `#e8dcc7`, `#d7c29d`, with broad soft ivory highlights and a subtle warm-gold shadow suggesting light across satin. No literal woven texture, repeated pattern, gold frame, black fill or new image asset was added. The background remains static, pointer-safe and behind the content. The gallery stays unchanged. Contrast is tested against a conservative darker sand bound; a regression test rejects any cool hue in the About backdrop layers.

## Rejected revision: blue-gray background design

The user found the white/ivory split insufficient and asked for background design to reduce the large white area. About now uses a clearly blue-gray gradient (`#ccd7e0` / `#e1e7e9` / `#d4e0e7`), a soft gold light wash and broad static tonal planes. There is no repeated pattern, raster texture, heavy border, black fill or added animation. All decorative layers ignore pointer events; content sits above them. About's small eyebrow and italic accent use darker bronze for contrast. Gallery styling, photo assets, content and typography remain unchanged. The earlier white variant described below is superseded.

Problem: About and the approved editorial partner gallery both use the same ivory surface. Their combined trailing/leading whitespace reads as one long chapter; the large photograph block's shadow adds visual weight.

1. White / ivory editorial chapters, with a restrained gold-to-warm-gray hairline. Selected: makes the boundary perceptible while keeping both sections light. Reduce About's trailing spacing, soften the collage shadow, remove its oversized TEXTILE watermark. Keep the partner gallery itself unchanged.
2. Muted navy About chapter. Strong separation but creates a much heavier block directly above two image-rich strips.
3. An inset About panel with a broad surrounding margin. Clear grouping but introduces another card-like container, which the user recently rejected in the partner design.
4. Retain identical backgrounds; use spacing and one rule only. Least invasive, but the tonal merger remains and the two sections are less distinct during scrolling.
5. A warmer linen-colored About surface. Fits textiles, but adds a stronger beige cast rather than reducing visual weight.

Implementation is scoped to `.brand-home .about` and its immediate boundary. About uses `#fbfaf7`; partner gallery retains `#f3efe7`. Divider matches the existing responsive container widths: max1280 / viewport minus88, 52, 38 or30px. The divider is decorative and has no text, interaction or layout height. About's bottom padding is88px desktop /56px mobile, manifesto-to-photo spacing56 /36px. No black, badges, frames, added raster images or new motion.

Only concept1 is implemented; the other four are ideas, not rendered alternatives. All content, photo assets, video, typography, gallery dimensions and uninterrupted two-way animation remain. QA is structural, logic and contrast; browser rendering has not been verified because the local preview surface is unavailable.
