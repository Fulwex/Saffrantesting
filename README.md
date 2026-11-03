# SAFFRAN — сайт (Preview)

B2B-сайт професійного текстилю для готелів, SPA та басейнів.

## Структура

- `v3/` — джерело правди: HTML, CSS, JS і використовувані ассети. Усі правки вносяться тут.
- `vercel-migration/` — статична Preview-збірка: копіює `v3`, чистить URL, вимикає форми, ставить `noindex`.

## Збірка

Vercel будує проєкт із корінням `vercel-migration`:

```
npm run sync && npm run build   # buildCommand у vercel.json
```

`sync` копіює з `../v3` лише ті ассети, на які є посилання в HTML/CSS/JS.
Вихідна директорія — `vercel-migration/public`.

Локально:

```
cd vercel-migration
npm run sync && npm run build && npm test
node qa-editorial.mjs
```

## Правила

- **Тільки Preview.** Гілка `main` не деплоїться взагалі — це зафіксовано у `vercel.json`
  (`git.deploymentEnabled.main = false`). Деплої йдуть із гілки `preview` і є Preview-деплоями.
- `saffran.ua` і чинний WordPress цей репозиторій не чіпає.
- Кожна сторінка віддається з `X-Robots-Tag: noindex, nofollow, noarchive` і мета-тегом `robots`.
- Форми в Preview демонстраційні — заявки не надсилаються. Не представляти Preview як робочий backend.
- Бізнес-модель B2B: без цін, платежів, доставки й роздрібного checkout.

## Що не в репозиторії

`assets/**/sources/` та `assets/partners/originals/` — вихідні матеріали для ретуші, лишаються
локально. У збірку потрапляють лише ассети, на які є посилання зі сторінок.
