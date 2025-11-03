# Configuración de MySQL con XAMPP

## Pasos para configurar MySQL

### 1. Configurar XAMPP
1. Abre XAMPP Control Panel
2. Inicia **Apache** y **MySQL**
3. Verifica que MySQL esté corriendo en el puerto 3306

### 2. Configurar la base de datos
1. Abre phpMyAdmin en tu navegador: `http://localhost/phpmyadmin`
2. O ejecuta el script automático: `npm run db:setup`

### 3. Variables de entorno
Verifica que tu archivo `.env` tenga estas configuraciones:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=radio_tv_directory
DB_USER=root
DB_PASSWORD=
```

**Nota**: Si tu MySQL de XAMPP tiene contraseña, agrégala en `DB_PASSWORD`

### 4. Migrar la base de datos
Ejecuta el comando completo para configurar todo:

```bash
npm run db:migrate
```

Este comando:
- Crea la base de datos si no existe
- Sincroniza las tablas
- Inserta datos de ejemplo

### 5. Comandos disponibles

```bash
# Configurar solo la base de datos
npm run db:setup

# Sincronizar tablas (crear/actualizar estructura)
npm run db:sync

# Resetear base de datos (elimina datos existentes)
npm run db:reset

# Insertar datos de ejemplo
npm run db:seed

# Configuración completa (recomendado)
npm run db:migrate
```

### 6. Verificar la conexión
Inicia el servidor:

```bash
npm run dev
```

Si ves el mensaje "Database connected successfully", la configuración es correcta.

### Troubleshooting

**Error: ER_ACCESS_DENIED_ERROR**
- Verifica usuario y contraseña en `.env`
- En XAMPP, el usuario por defecto es `root` sin contraseña

**Error: ECONNREFUSED**
- Verifica que MySQL esté corriendo en XAMPP
- Verifica el puerto (por defecto 3306)

**Error: ER_BAD_DB_ERROR**
- Ejecuta `npm run db:setup` para crear la base de datos