# Partner photograph presentation

The current homepage uses individually relit ImageGen photo edits in `assets/partners/relight-v1/`, with square PNG masters retained in `sources/`. Full prompts and provenance are in `PARTNER-RELIGHT-PROMPTS.md`. These are edited images, not unretouched or pixel-identical proof photographs. All original work-N WebPs and all 26 original uploads remain untouched.

The former `partnerLogoCrops` geometry in `partner-data.mjs` is retained for rollback to source photographs. Current responsive image paths and normalized square viewing windows are in `partner-retouch-assets.mjs`. Viewing windows use uniform scaling with no CSS tilt, skew or perspective correction. Lighting is baked into the edited master; no additional brightness, contrast or saturation filter is applied to the current images.

Smooth cotton in Feel Clinic and BURSA remains smooth cotton rather than invented terry. The tone-on-tone Seven Lakes design stays jacquard rather than contrasting embroidery. Previously rejected studio trials in `assets/partners/logos/` are not connected.

All 17 cards remain non-interactive: no image links, buttons, zoom, modal, click handler or gallery data. Names and locations remain visible. Two duplicated tracks provide continuous opposing motion. Older site versions and other site sections were not changed by this revision.

Validation: all 17 masters and 34 responsive WebPs exist, correct square dimensions, valid non-distorting viewing windows, 2874 KB total for 800px variants / 798 KB for 400px variants. Structural homepage and marquee logic tests pass. The edited images were visually inspected individually; browser page rendering was not tested because local browser access was unavailable. No online deployment was performed.
