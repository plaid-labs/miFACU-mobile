# Script de PowerShell para crear el archivo .env
# Ejecuta este script desde la carpeta Docker

Write-Host "🔧 Configurando archivo .env para MiFacu Backend" -ForegroundColor Cyan
Write-Host ""

$backendEnvPath = "..\backend\.env"
$backendEnvExamplePath = "..\backend\.env.example"

# Verificar si ya existe .env
if (Test-Path $backendEnvPath) {
    Write-Host "⚠️  El archivo .env ya existe en backend/.env" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (s/N)"
    if ($overwrite -ne "s" -and $overwrite -ne "S") {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit
    }
}

# Crear archivo .env desde el ejemplo si existe
if (Test-Path $backendEnvExamplePath) {
    Copy-Item $backendEnvExamplePath $backendEnvPath
    Write-Host "✅ Archivo .env creado desde .env.example" -ForegroundColor Green
} else {
    # Crear archivo .env básico
    $envContent = @"
# Archivo de configuración de variables de entorno
# IMPORTANTE: Completa estos valores con tus credenciales reales

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
"@
    Set-Content -Path $backendEnvPath -Value $envContent
    Write-Host "✅ Archivo .env creado con valores por defecto" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Ahora edita el archivo backend/.env y completa con tus valores reales:" -ForegroundColor Yellow
Write-Host "   1. DATABASE_URL - URL de conexión a Supabase" -ForegroundColor White
Write-Host "   2. SUPABASE_URL - URL de tu proyecto Supabase" -ForegroundColor White
Write-Host "   3. SUPABASE_KEY - Tu clave anon de Supabase" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para obtener DATABASE_URL:" -ForegroundColor Cyan
Write-Host "   - Ve a https://app.supabase.com" -ForegroundColor White
Write-Host "   - Selecciona tu proyecto" -ForegroundColor White
Write-Host "   - Settings > Database > Connection string > URI" -ForegroundColor White
Write-Host ""
