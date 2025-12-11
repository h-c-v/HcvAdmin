# Actualización de Node.js a 22.12.0

## Paso 1: Actualizar Node.js

### Opción A: Usando nvm (recomendado)
```bash
nvm install 22.12.0
nvm use 22.12.0
nvm alias default 22.12.0
```

### Opción B: Usando fnm
```bash
fnm install 22.12.0
fnm use 22.12.0
fnm default 22.12.0
```

### Opción C: Descarga manual
Visita https://nodejs.org/ y descarga Node.js 22.12.0

## Paso 2: Verificar la instalación
```bash
node --version  # Debería mostrar v22.12.0
```

## Paso 3: Reinstalar dependencias
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Paso 4: Build y test
```bash
pnpm run build
pnpm run dev
```

## Configurado en el proyecto:
- ✅ .nvmrc con versión 22.12.0
- ✅ Vite 7.2.7
- ✅ React 18.3.1 (estable y compatible)
- ✅ @radix-ui/react-dropdown-menu 2.1.16 (última versión)
