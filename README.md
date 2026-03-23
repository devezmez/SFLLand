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
