# 🌻 SFL Farm Advisor

Analizá tu granja de Sunflower Land y obtené estrategias personalizadas para maximizar tus ganancias en **$SFL**.

## Estructura del proyecto

```
sfl-advisor/
├── public/
│   └── index.html          ← Aplicación web completa
├── netlify/
│   └── functions/
│       └── proxy.js        ← Proxy que resuelve el CORS con sfl.world
├── netlify.toml            ← Configuración de Netlify
└── package.json
```

## Cómo deployar en Netlify

### Opción A — GitHub + Netlify (recomendado)

1. Subí esta carpeta a un repo de GitHub
2. Entrá a [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Seleccioná tu repo
4. En "Build settings":
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click "Deploy site"

### Opción B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=public --functions=netlify/functions
```

## Cómo usar

1. Elegí el tipo de búsqueda: **Username**, **Farm ID** o **NFT ID**
2. Ingresá el valor (ej: `ezmez` o `441`)
3. Click en **"Analizar Granja"**
4. Una vez cargada, click en **"Generar estrategia"** para el análisis AI

## APIs utilizadas

- `sfl.world/api/v1.1/exchange` — Precios SFL, POL, Gems
- `sfl.world/api/v1/prices` — Floor prices P2P y Sequence Market
- `sfl.world/api/v1/land/{nft_id}` — Boosts de la granja
- `sfl.world/api/v1.1/land/{nft_id}` — Info completa de la granja
- `sfl.world/api/v1/land/info/{type}/{value}` — Resolver IDs

El proxy en `netlify/functions/proxy.js` maneja el CORS automáticamente.
