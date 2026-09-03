# Verificar Conexión a Supabase VPS
# Ejecutar desde la carpeta del proyecto

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO CONEXIÓN A SUPABASE    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el backend esté corriendo
Write-Host "1. Verificando si el backend está corriendo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend corriendo en puerto 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend no está corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend; npm run dev" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar conexión a la base de datos
Write-Host "2. Verificando conexión a la base de datos..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health/db" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Conexión a BD exitosa" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Error al conectar con la BD" -ForegroundColor Red
    Write-Host "   Verifica que el esquema 'resuelve' esté creado" -ForegroundColor Yellow
}

# 3. Verificar Supabase URL
Write-Host "3. Verificando Supabase URL..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://supabase.somosdostudio.com/rest/v1/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Supabase accesible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ No se puede acceder a Supabase" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN ACTUAL              " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Leer .env
if (Test-Path "C:\Users\Waiha\Resuelve App\backend\.env") {
    $envContent = Get-Content "C:\Users\Waiha\Resuelve App\backend\.env" -Raw
    
    if ($envContent -match "SUPABASE_URL=(.+)") {
        Write-Host "SUPABASE_URL: $($Matches[1])" -ForegroundColor White
    }
    if ($envContent -match "DATABASE_URL=(.+)") {
        $dbUrl = $Matches[1]
        # Ocultar password
        $dbUrlHidden = $dbUrl -replace ':[^@]+@', ':***@'
        Write-Host "DATABASE_URL: $dbUrlHidden" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  LISTO PARA DESARROLLAR            " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
