# Resuélvelo App - Complete Setup Script
# Run this script in PowerShell as Administrator

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  RESUÉLVELO APP - SETUP COMPLETO    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "Descárgalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location "C:\Users\Waiha\Resuelve App\backend"
npm install

Write-Host ""
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "📱 Instalando dependencias del móvil..." -ForegroundColor Yellow
Set-Location "C:\Users\Waiha\Resuelve App\mobile"
npm install

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ INSTALACIÓN COMPLETADA          " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configurar Supabase:" -ForegroundColor Yellow
Write-Host "   - Ve a tu dashboard de Supabase"
Write-Host "   - Obtén las credenciales (URL, Keys)"
Write-Host ""
Write-Host "2. Ejecutar SQL en Supabase:" -ForegroundColor Yellow
Write-Host "   - Copia el contenido de backend/prisma/migrations/001_init.sql"
Write-Host "   - Pégalo en el SQL Editor de Supabase"
Write-Host "   - Ejecuta el script"
Write-Host ""
Write-Host "3. Configurar variables de entorno:" -ForegroundColor Yellow
Write-Host "   - Edita backend/.env con tus credenciales"
Write-Host ""
Write-Host "4. Iniciar el backend:" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "5. Iniciar la app móvil:" -ForegroundColor Yellow
Write-Host "   cd mobile"
Write-Host "   npx expo start"
Write-Host ""
