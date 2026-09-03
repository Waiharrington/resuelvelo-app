# Resuélvelo App - Backend Installation Script
# Run this script in PowerShell

Write-Host "🚀 Instalando Backend de Resuélvelo..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location "C:\Users\Waiha\Resuelve App\backend"

# Install dependencies
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Create .env from example if not exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Por favor编辑a el archivo .env con tus credenciales de Supabase" -ForegroundColor Red
}

Write-Host "✅ Backend instalado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Editar el archivo .env con tus credenciales de Supabase"
Write-Host "2. Ejecutar el script SQL en tu base de datos Supabase"
Write-Host "3. Ejecutar: npm run dev"
