# Mercados IRAY — Inventario y Caja

Aplicación web de **inventario y control operativo** para Mercados IRAY (tienda de
abarrotes, Bogotá). Está pensada para usarse rápido en el mostrador, con letra
grande, botones claros y alertas muy visuales.

Resuelve el reto de **digitalizar los procesos operativos**:

- **Inicio (Tablero):** total de productos, alertas de vencimiento, alertas de
  stock bajo, valor del inventario y el saldo de caja del día.
- **Inventario:** tabla con código de barras, producto, categoría, stock actual,
  stock mínimo, precio y vencimiento. Buscar, filtrar por categoría, ordenar y
  subir/bajar stock con un toque. Agregar, editar y eliminar productos.
- **Lector de código de barras:** una barra siempre activa arriba. El lector
  físico "escribe" el código y termina con **Enter**; el producto aparece al
  instante para **registrar la venta** (descuenta stock y suma el ingreso a caja).
  Si el código no existe, ofrece crear el producto.
- **Caja:** registrar ingresos y egresos del día. Las ventas hechas con el lector
  entran solas. Reemplaza el cuaderno de contabilidad.

Los datos se guardan **en el mismo equipo** (en el navegador). No necesita
internet ni cuenta para funcionar.

---

## Opción 1 — Usar sin instalar nada (lo más fácil)

Abre el archivo **`MercadosIRAY-app.html`** con doble clic. Funciona en cualquier
computador con Chrome, Edge o Firefox, sin instalar nada. Ideal para empezar hoy
mismo en el mostrador.

> Sugerencia: cópialo al Escritorio y crea un acceso directo para abrirlo rápido.

## Opción 2 — Publicar en internet con Vercel (acceso desde cualquier equipo)

Requiere Node.js 18+.

```bash
# 1. Probar en tu computador
npm install
npm run dev        # abre http://localhost:5173

# 2. Subir a GitHub
git init && git add . && git commit -m "Mercados IRAY"
git remote add origin https://github.com/USUARIO/REPO.git
git branch -M main && git push -u origin main

# 3. En vercel.com → Add New Project → importar el repo → Deploy
#    Vercel detecta Vite automáticamente gracias a vercel.json.
```

El proyecto ya incluye `vercel.json` con `outputDirectory: "dist"`, y `vite` está
en `dependencies`, así que el despliegue funciona sin ajustes.

---

## Atajos de teclado

- **`/`** — pone el cursor en la barra del lector para escribir un código.
- **`Enter`** — busca el código escaneado y abre la venta.
- **`Esc`** — cierra cualquier ventana abierta.

## Estructura del proyecto

```
mercados-iray/
├── MercadosIRAY-app.html   ← versión lista para usar sin instalar
├── index.html              ← entrada de Vite
├── package.json
├── vercel.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx             ← lógica principal, navegación, lector
    ├── lib/
    │   ├── theme.js        ← colores y tipografías
    │   ├── format.js       ← pesos COP, fechas, estados (semáforo)
    │   └── storage.js      ← guardado local + catálogo de ejemplo
    └── components/
        ├── ScannerBar.jsx  ← barra del lector de código
        ├── Dashboard.jsx   ← tablero de inicio
        ├── Inventory.jsx   ← tabla de inventario
        ├── Cash.jsx        ← caja (ingresos/egresos)
        ├── ProductModal.jsx← agregar/editar producto y venta
        ├── Toast.jsx       ← avisos
        └── ui.jsx          ← botones, iconos, insignias
```

## ¿Y si más adelante quieren varios equipos sincronizados?

Hoy cada equipo guarda su propia copia local (suficiente para empezar). Si en el
futuro quieren que dos computadores compartan el mismo inventario, se puede
conectar **Supabase** reemplazando `src/lib/storage.js` por llamadas a la base de
datos. Las variables irían en `.env` con el prefijo `VITE_` (ver `.env.example`).
