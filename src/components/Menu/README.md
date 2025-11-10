# 📁 Componentes del Menú Principal

Esta carpeta contiene los componentes modulares del menú principal de navegación, separados por responsabilidad.

## 📂 Estructura de Archivos

```
Menu/
├── index.jsx          # Componente principal que decide Desktop o Mobile
├── MenuItem.jsx       # Componente de ítem de menú reutilizable
├── MenuDesktop.jsx    # Versión del menú para escritorio
└── MenuMobile.jsx     # Versión del menú para móvil
```

## 🎨 Características

### ✅ Colores VERDES

- Todos los componentes usan tema **verde** (green.500, green.600, etc.)
- Coincide con los botones y footer de la aplicación
- Mejor consistencia visual en toda la app

### 📱 MenuMobile.jsx

- **Botón hamburguesa** debajo del logo (no flotante)
- **Menú desplegable** que se abre hacia abajo desde el botón
- **Click fuera** para cerrar el menú
- **Cierre automático** al navegar a otra página
- **Overlay oscuro** con backdrop blur cuando está abierto
- Ancho fijo de **280px**

### 💻 MenuDesktop.jsx

- **Sidebar colapsable** de 70px (cerrado) a 260px (expandido)
- **Tooltips** en los iconos cuando está colapsado
- **Click fuera** para cerrar el menú expandido
- **Sticky position** para mantenerlo visible al hacer scroll
- Indicador visual animado en la parte inferior

### 🔧 MenuItem.jsx

- Componente **reutilizable** para items de menú
- Detecta ruta **exacta** para marcar como activo (no prefijos)
- Soporte para **submenús** con animación Collapse
- **Badge** con contador de subitems
- Barra verde vertical de **4px** en item activo
- Animaciones suaves con cubic-bezier

## 🚀 Uso

Importar desde la raíz del componente:

\`\`\`jsx
import MenuPrincipalD from "./components/MenuPrincipalD";
// o
import MenuPrincipalD from "./components/Menu";
\`\`\`

El componente detecta automáticamente si es mobile o desktop y renderiza la versión apropiada.

## 🔍 Detección de Página Activa

**IMPORTANTE**: La página activa ahora se detecta con **igualdad exacta** (`===`), no con `startsWith()`.

Esto significa:

- ✅ `/historialPedido/listar` → **Solo** marca "Historial Pedido" como activo
- ❌ `/historialPedido/listar` → **NO** marca "Pedido" como activo

Antes con `startsWith()`:

- ❌ `/historialPedido/listar` → Marcaba "Pedido" Y "Historial Pedido" (incorrecto)

## 🎯 Breakpoints

- **Mobile**: `base` (< 768px)
- **Desktop**: `md` (≥ 768px)

## 📦 Dependencias

- `@chakra-ui/react` - Componentes UI
- `react-router-dom` - Navegación
- `react-redux` - Estado global
- `react-icons` - Iconos del catálogo

## 🐛 Solución de Problemas

### El menú no se ve en móvil

- Verificar que el botón hamburguesa esté visible debajo del logo
- Revisar que `useBreakpointValue` retorne `true` para mobile

### El menú no se cierra al hacer click fuera

- Verificar que `useRef` esté correctamente asignado al contenedor
- Revisar que los event listeners se agreguen/remuevan correctamente

### El item activo no se marca correctamente

- Verificar que la ruta en el módulo coincida **exactamente** con `location.pathname`
- Revisar que no haya rutas con parámetros dinámicos (`:id`, etc.)

## 📝 Notas de Migración

El archivo original `MenuPrincipalD.jsx` ahora solo re-exporta el nuevo componente modular.

Para mantener compatibilidad con código existente, NO cambiar las importaciones:
\`\`\`jsx
// ✅ Sigue funcionando
import MenuPrincipalD from "./components/MenuPrincipalD";
\`\`\`

---

**Última actualización**: 10 de noviembre de 2025
