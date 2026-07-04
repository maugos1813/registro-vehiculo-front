# Frontend - Registro de Vehículos (Gamonaltrasporti)

App para choferes hecha con **Vite + React + Tailwind + Axios**, diseñada para completar un registro de toma/entrega de vehículo en menos de 15 segundos desde el celular.

**Estilo:** minimalista tipo Apple (fondo gris claro #F5F5F7, acentos azul/naranja tipo iOS, tarjetas blancas flotantes) combinado con un lenguaje "burbuja": todo lo interactivo (botones, inputs, chips, navegación) usa cápsulas y esquinas muy redondeadas, con la tipografía **Baloo 2** (redondeada) para títulos.

## 🚀 Instalación

```bash
npm install
cp .env.example .env
# Edita .env y pon la URL de tu backend, ej:
# VITE_API_URL=http://localhost:3000        (desarrollo local)
# VITE_API_URL=https://tu-api.onrender.com  (producción)

npm run dev      # http://localhost:5173
```

Para producción:
```bash
npm run build     # genera /dist
npm run preview   # sirve /dist localmente para probar el build
```
`dist/` se puede subir a cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, o el mismo Render como "Static Site").

## 📱 Pantallas

1. **Registrar** (pantalla principal) — el chofer elige TOMAR o DEJAR con un slider tipo cápsula, escribe/busca su nombre y la targa del vehículo (autocompletado con lo que ya existe en el backend, y si no existe lo crea al vuelo), agrega comentarios y fotos, y confirma. La fecha/hora se muestra en vivo y se guarda automáticamente en el servidor.
2. **Historial** — lista de todos los movimientos, con filtro por Todos/Tomas/Entregas y buscador por chofer/targa/comentario. Tocar un registro abre el detalle en una hoja inferior (bottom sheet) con las fotos en grande y opción de eliminar.
3. **Flota** — estado en tiempo real de cada vehículo: libre o en uso, con quién y desde cuándo.

## 🗂️ Estructura

```
src/
├── api/            # Axios: choferes.js, vehiculos.js, registros.js, client.js
├── components/ui/  # Piezas reutilizables (SegmentedToggle, ComboBox, PhotoPicker, BottomNav, Badge, BottomSheet)
├── context/         # ToastContext (notificaciones)
├── hooks/           # useClock
├── screens/         # RegistrarScreen, HistorialScreen, VehiculosScreen
├── utils/           # format.js (fechas en español)
├── App.jsx
└── main.jsx
```

## 🎨 Tokens de diseño (tailwind.config.js)

| Token | Valor | Uso |
|-------|-------|-----|
| `canvas` | `#F5F5F7` | Fondo general |
| `toma` | `#0A84FF` | Acción de tomar el vehículo |
| `deja` | `#FF9F0A` | Acción de dejar el vehículo |
| `good` / `bad` | `#30D158` / `#FF453A` | Estados libre/en uso, éxito/error |
| `font-display` | Baloo 2 | Títulos y botones (look "burbuja") |
| `font-body` | Inter | Texto de lectura |
| `rounded-bubble` | `1.75rem` | Tarjetas |
| `rounded-pill` | `999px` | Botones, inputs, chips, nav |

## 🔌 Conexión con el backend

Este frontend consume exactamente los endpoints del backend `registro-vehiculos-back`:
- `GET/POST/PUT/DELETE /api/choferes`
- `GET/POST/PUT/DELETE /api/vehiculos`
- `GET/POST/PUT/DELETE /api/registros`, `GET /api/registros/ultimo/:vehiculoId`

Asegúrate de que el backend tenga CORS habilitado (ya lo tiene, con `cors()`) y que `VITE_API_URL` apunte a la URL correcta.
