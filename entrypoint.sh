#!/bin/sh

echo "📌 Esperando que PostgreSQL esté listo..."
until pg_isready -h db -p 5432 -U "$POSTGRES_USER"; do
  sleep 2
done

echo "✅ PostgreSQL está listo."

echo "🚀 Ejecutando migraciones de Prisma..."
npx prisma migrate dev --name "init"

if [ -f "/app/dump-DB_backend-backup.sql" ]; then
    echo "📂 Restaurando backup.sql en PostgreSQL..."
    psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/dump-DB_backend-backup.sql
    echo "✅ Base de datos migrada y backup restaurado."
else
    echo "⚠️ No se encontró dump-DB_backend-backup.sql, saltando restauración."
fi

echo "🔥 Iniciando la aplicación..."
exec npm run dev  # Cambia a "start" si es producción
