# Resuélvelo App - Configuration Checker
# Run this script to verify your setup

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE CONFIGURACIÓN      " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js no encontrado" -ForegroundColor Red
}

# Check npm
Write-Host "2. Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm no encontrado" -ForegroundColor Red
}

# Check backend dependencies
Write-Host "3. Verificando dependencias del backend..." -ForegroundColor Yellow
Set-Location "C:\Users\Waiha\Resuelve App\backend"
if (Test-Path "node_modules") {
    Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "   ❌ Dependencias no instaladas (ejecuta: npm install)" -ForegroundColor Red
}

# Check .env file
Write-Host "4. Verificando archivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ Archivo .env existe" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "SUPABASE_URL=.+supabase\.co") {
        Write-Host "   ✅ SUPABASE_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  SUPABASE_URL no configurado correctamente" -ForegroundColor Yellow
    }
    if ($envContent -match "DATABASE_URL=.+") {
        Write-Host "   ✅ DATABASE_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  DATABASE_URL no configurado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Archivo .env no encontrado (copia .env.example a .env)" -ForegroundColor Red
}

# Check Prisma
Write-Host "5. Verificando Prisma..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client\index.js") {
    Write-Host "   ✅ Cliente Prisma generado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Cliente Prisma no generado (ejecuta: npx prisma generate)" -ForegroundColor Red
}

# Check mobile
Write-Host "6. Verificando app móvil..." -ForegroundColor Yellow
Set-Location "C:\Users\Waiha\Resuelve App\mobile"
if (Test-Path "node_modules") {
    Write-Host "   ✅ Dependencias móviles instaladas" -ForegroundColor Green
} else {
    Write-Host "   ❌ Dependencias móviles no instaladas (ejecuta: npm install)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  RESUMEN                           " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si todo está ✅, puedes iniciar:" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:" -ForegroundColor Yellow
Write-Host "   cd C:\Users\Waiha\Resuelve App\backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "App Móvil:" -ForegroundColor Yellow
Write-Host "   cd C:\Users\Waiha\Resuelve App\mobile"
Write-Host "   npx expo start"
Write-Host ""
