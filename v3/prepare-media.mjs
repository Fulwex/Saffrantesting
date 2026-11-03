import sharp from 'sharp';
import path from 'node:path';

const source = 'C:/Users/gemuk/AppData/Local/Temp';
const output = path.resolve('assets');
const photos = [
  ['codex-clipboard-5713b8be-168d-4e72-8c79-442bc8903206.png', 'about-complete.webp', 1200, 1200],
  ['codex-clipboard-10e92a9c-5aea-4a9b-92fb-e7b6b379cf17.png', 'linen-lifestyle.webp', 1400, 1800],
  ['codex-clipboard-50ad6e65-2b3f-4eee-8ce4-237e353c54d3.jpg', 'pillow-detail-dog.webp', 1100, 1700],
  ['codex-clipboard-b39820ac-8ea7-4f24-8417-2594d7f7e4f4.jpg', 'hotel-pillow-towel.webp', 1200, 1800],
  ['codex-clipboard-3aca55f3-b7d3-45b8-8dc6-466c91a47d82.png', 'robe-closeup.webp', 1000, 1500],
  ['codex-clipboard-983f60e3-99e8-4ee0-9fac-b7f21b2f3bab.png', 'pool-towels.webp', 1200, 1200],
  ['codex-clipboard-52267f37-b6c7-467f-8342-7d1b6bff4c21.jpg', 'personalized-textile.webp', 1400, 900],
  ['codex-clipboard-3d202f5c-9026-4f56-891f-ef8da1b37d46.jpg', 'pillow-protector.webp', 1200, 1800],
  ['codex-clipboard-bd780fbd-22f8-48a7-bcd7-6ad097883ffe.jpg', 'mattress-protector.webp', 1200, 1800],
  ['codex-clipboard-230eb6f2-18f0-4a56-9971-0e995d64b2f3.jpg', 'bath-mat.webp', 1600, 1200],
  ['codex-clipboard-c031c486-2671-48d3-876a-7122cb96cd7b.jpg', 'assortment-bedroom.webp', 1300, 1900],
  ['codex-clipboard-d5fe9dbc-841f-493c-896c-14be37f89ddd.jpg', 'spa-brown-towels.webp', 1200, 1200],
  ['codex-clipboard-65bf08e9-0164-42ac-bf39-108c3b8c8b6f.jpg', 'spa-pool-loungers.webp', 1100, 1500],
  ['codex-clipboard-aae6f740-b8bd-40f4-a99d-25d984585194.jpg', 'catalog-white-towels.webp', 1200, 1200],
  ['codex-clipboard-962bb20d-f29e-4eb2-938b-ebb671a499bc.jpg', 'catalog-white-robes.webp', 1100, 1700],
  ['codex-clipboard-a0be6ed0-a02f-40f7-990a-48147784ef9d.jpg', 'catalog-hotel-bed.webp', 1800, 1350],
  ['codex-clipboard-893d6699-283b-4380-9f05-9b52f1f302c2.jpg', 'catalog-hotel-bed-selected.webp', 1800, 1350],
];

for (const [file, name, width, height] of photos) {
  const result = await sharp(path.join(source, file))
    .rotate()
    .resize({ width, height, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(output, name));
  console.log(`${name}: ${result.width}x${result.height}, ${result.size} bytes`);
}
