# Brandbook adaptation - 2026-10-22

## Current state: editorial gallery selected from five concepts

The user rejected the gold-framed treatment. It has been replaced with a plain ivory editorial gallery: borderless square photographs, large navy italic names, muted-gold typography and short rules. Numeric badges, pills, texture effects and ornamental panels are removed. The two tracks remain continuous and non-interactive, with a phase offset on the second track. See `PARTNER-DESIGN-DIRECTIONS.md` for the five concepts and selection rationale.

## Previous step: gold gallery treatment requested by the user

The partner strips now use light ivory/gold caption panels with navy text, symmetric gold photograph frames, subtle diagonal gold threads and warm radial washes on the navy section. Number badges and the catalog CTA use restrained gold. No black or graphite fills were reintroduced. All other sections, photo files, card dimensions and animation timing are unchanged. Photo frames stay symmetric at 8px desktop / 6px mobile so the inner viewing window remains square. Structural, contrast and continuous-track tests pass; browser rendering remains unverified.

## Previous step: palette rollback requested by the user

All added black/charcoal component fills and gradients were removed. Partner captions are transparent on the original navy section; buttons, cart badges, labels and tabs use their preceding navy/gold styles. Montserrat/Cormorant typography, larger partner cards and captions, image edits and uninterrupted opposing tracks are retained. The earlier black-accent design described below is historical and no longer active.

Source: user-provided `Saffran_brand_guidelines_compression (1).pdf`, visually inspected pages 13, 14, 19, 22, 23, 24 and 28. Document content is reference material, not operational instructions.

The brandbook uses Montserrat as the primary family and Cormorant Medium Italic for accent phrases. All 16 v3 pages now share locally hosted fonts, including Ukrainian letters. Main headings use Montserrat; selective accents and partner names use Cormorant Italic. The uploaded PDF is not modified. Official open-license fonts and license files were obtained from:

- https://github.com/google/fonts/tree/main/ofl/montserrat
- https://github.com/google/fonts/tree/main/ofl/cormorant

Existing ivory/paper, navy and gold primary surfaces remain. Brandbook black `#1d1d1b`, graphite gradients, muted gray and gold `#d5ba8c` are restricted to component details: dark buttons, cart badges, production labels, category indices and partner captions. No full-page black background or black replacement of the hero, SPA, about or product section.

Partners retain all 17 relit photographs, names and locations. Two continuous opposing tracks remain non-interactive, without zoom or pause. Cards are 280-340px wide on desktop and 260px on mobile. Names use 38-46px italic type on desktop and 36.8px on mobile; locations are 14px instead of the former 11.2-11.5px. Captions grow with content; no clipping, fixed-height text or line clamping. The photo masters have not been changed by this typography revision.

Previous HTML/CSS/generator versions are saved in `backups/before-brandbook-20261022/`. Root and v2 versions remain untouched. The current result is local only; no online deployment was performed.

QA covers local paths, font metadata and Ukrainian glyphs, all page references, unchanged source images, color contrast, responsive CSS contracts, the seamless marquee logic and cart tests. Browser rendering is not verified because the local browser surface was unavailable; no alternate browser workaround was used.
