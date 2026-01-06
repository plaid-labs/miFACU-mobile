# Docker Setup para MiFacu

Este directorio contiene la configuración de Docker para dockerizar el backend de MiFacu.

## Requisitos Previos

- Docker instalado
- Docker Compose instalado

## Configuración

### Paso 1: Crear archivo `.env`

**⚠️ IMPORTANTE:** Debes crear el archivo `.env` antes de iniciar Docker.

**Opción A - Usando el script (Windows PowerShell):**
```powershell
cd Docker
.\setup-env.ps1
```

**Opción B - Manualmente:**
```powershell
cd backend
# Si existe .env.example:
Copy-Item .env.example .env
# Si no existe, crea el archivo manualmente
```

### Paso 2: Configurar variables de entorno

Edita el archivo `backend/.env` y completa con tus valores:

```env
# URL de conexión a Supabase (OBLIGATORIO)
# Obtén esta URL desde: Supabase Dashboard > Settings > Database > Connection string > URI
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.TU_PROYECTO.supabase.co:5432/postgres

# Credenciales de Supabase (opcional)
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_KEY=tu-supabase-anon-key-aqui

# Puerto del servidor (opcional, por defecto 4000)
PORT=4000

# Entorno
NODE_ENV=production
```

**📝 Cómo obtener DATABASE_URL de Supabase:**
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Settings → Database
3. Connection string → URI
4. Copia la URL y reemplaza `[YOUR-PASSWORD]` con tu contraseña real

**⚠️ IMPORTANTE:** 
- El archivo `.env` debe estar en `backend/.env` (no en `Docker/`)
- No subas el archivo `.env` a Git (ya está en .gitignore)
- Sin el archivo `.env`, el contenedor no iniciará correctamente

## Uso

### Construir y levantar los servicios

```bash
cd Docker
docker-compose up -d --build
```

### Ver logs

```bash
docker-compose logs -f backend
```

### Detener los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (si usas PostgreSQL local)

```bash
docker-compose down -v
```

### Reconstruir solo el backend

```bash
docker-compose build backend
docker-compose up -d backend
```

## Servicios

### Backend
- **Puerto**: 4000
- **URL**: http://localhost:4000
- **Health Check**: http://localhost:4000/

### PostgreSQL (Opcional)
Si descomentas el servicio de PostgreSQL en `docker-compose.yml`:
- **Puerto**: 5432
- **Usuario por defecto**: mifacu
- **Contraseña por defecto**: mifacu123
- **Base de datos**: mifacu

## Desarrollo

Para desarrollo local sin Docker, usa:

```bash
cd ../backend
npm run dev
```

## Troubleshooting

### El backend no inicia
1. Verifica que las variables de entorno estén correctas
2. Revisa los logs: `docker-compose logs backend`
3. Verifica que el puerto 4000 no esté en uso

### Problemas de conexión a la base de datos
1. Si usas Supabase, verifica que la URL y la key sean correctas
2. Si usas PostgreSQL local, asegúrate de que el servicio esté corriendo
3. Verifica que la variable `DATABASE_URL` tenga el formato correcto

### Reconstruir desde cero
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
