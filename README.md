# Huella Propia — Plataforma de Inteligencia Legislativa

## Requisitos previos

- Node.js 18+ instalado → https://nodejs.org
- Cuenta en GitHub → https://github.com
- Cuenta en Vercel → https://vercel.com (gratis, logueate con GitHub)
- API Key de Anthropic → https://console.anthropic.com

---

## Paso 1: Instalar el proyecto en tu máquina

Abrí una terminal y ejecutá:

```bash
# Cloná o copiá esta carpeta a tu máquina
cd huellapropia-app

# Instalá las dependencias
npm install
```

## Paso 2: Configurar las variables de entorno

```bash
# Copiá el archivo de ejemplo
cp .env.example .env.local

# Editalo con tu editor y poné tu API Key real:
# ANTHROPIC_API_KEY=sk-ant-TU-KEY-REAL
# APP_PASSWORD=laContraseñaQueQuieras
```

## Paso 3: Probar en local

```bash
npm run dev
```

Abrí http://localhost:3000 en tu navegador. Vas a ver el login.
Ingresá la contraseña que pusiste en APP_PASSWORD.

## Paso 4: Subir a GitHub

```bash
git init
git add .
git commit -m "Huella Propia v1"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/huellapropia-app.git
git push -u origin main
```

## Paso 5: Desplegar en Vercel

1. Andá a https://vercel.com/new
2. Importá tu repositorio de GitHub
3. En "Environment Variables" agregá:
   - `ANTHROPIC_API_KEY` = tu API key
   - `APP_PASSWORD` = la contraseña de acceso
4. Hacé click en "Deploy"
5. En 1-2 minutos tenés tu app en una URL tipo: huellapropia-app.vercel.app

## Paso 6: Conectar tu dominio (opcional)

En Vercel → Settings → Domains → agregá `app.huellapropia.net`
Después configurá los DNS en tu proveedor de dominio.

---

## Estructura del proyecto

```
/app
  /page.tsx            → Login
  /analisis/page.tsx   → Módulo 1: Análisis Legislativo
  /api/chat/route.ts   → Proxy seguro para la API de Claude
  /globals.css         → Estilos globales
  /layout.tsx          → Layout raíz
```

## Seguridad

- La API Key de Anthropic NUNCA llega al navegador del usuario
- El proxy `/api/chat` la usa solo del lado del servidor
- El acceso está protegido por contraseña
- Vercel encripta las variables de entorno

## Agregar más módulos

Para agregar el Módulo 3 (Contenido), creá una carpeta `/app/contenido/page.tsx`
y seguí el mismo patrón que `/app/analisis/page.tsx`.

## Soporte

Contacto: huellapropia.net | @huella.propia
