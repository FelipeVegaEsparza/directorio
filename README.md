# Directorio de Radios y TV Online

Una plataforma web completa para crear un directorio centralizado de radios y canales de TV online, con frontend público y panel de administración.

## 🚀 Características

- **Frontend Público**: Directorio navegable con buscador, filtros y perfiles de medios
- **Panel de Administración**: CRUD completo para gestión de medios
- **Reproductor Integrado**: Soporte para streaming de audio y video
- **Sistema de Solicitudes**: Formulario para que nuevos medios se unan
- **Diseño Responsive**: Compatible con todos los dispositivos
- **Dashboard de Estadísticas**: Métricas de uso y popularidad

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con SSR/SSG
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework de estilos
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Sequelize** - ORM para MySQL
- **JWT** - Autenticación
- **Multer** - Subida de archivos
- **Joi** - Validación de datos

### Base de Datos
- **MySQL** - Base de datos relacional

## 📁 Estructura del Proyecto

```
directorio/
├── frontend/          # Aplicación Next.js
│   ├── src/
│   │   ├── app/       # App Router de Next.js
│   │   ├── components/# Componentes React
│   │   ├── lib/       # Utilidades y configuración
│   │   └── types/     # Tipos TypeScript
│   └── public/        # Archivos estáticos
├── backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/# Controladores de rutas
│   │   ├── models/    # Modelos de Sequelize
│   │   ├── routes/    # Definición de rutas
│   │   ├── middleware/# Middleware personalizado
│   │   ├── services/  # Lógica de negocio
│   │   ├── config/    # Configuración
│   │   └── types/     # Tipos TypeScript
│   └── uploads/       # Archivos subidos
└── .kiro/            # Especificaciones del proyecto
    └── specs/
        └── radio-tv-directory/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## 🚦 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Crear base de datos MySQL:
```sql
CREATE DATABASE radio_tv_directory;
```

5. Ejecutar en modo desarrollo:
```bash
npm run dev
```

### Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## 📊 Estado del Desarrollo

### ✅ Completado
- [x] Análisis de requerimientos
- [x] Diseño del sistema
- [x] Planificación de implementación
- [x] Configuración inicial del proyecto

### 🔄 En Progreso
- [ ] Modelos de datos y base de datos
- [ ] APIs del backend
- [ ] Componentes del frontend
- [ ] Panel de administración

### 📋 Próximas Tareas
Ver el archivo `.kiro/specs/radio-tv-directory/tasks.md` para la lista completa de tareas pendientes.

## 🤝 Contribución

Este proyecto sigue la metodología de desarrollo dirigido por especificaciones. Para contribuir:

1. Revisar las especificaciones en `.kiro/specs/radio-tv-directory/`
2. Seguir las tareas definidas en `tasks.md`
3. Mantener la consistencia con el diseño establecido

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Contacto

Para más información sobre el proyecto, consultar la documentación en el directorio `.kiro/specs/`.

---

**Desarrollado con ❤️ para la comunidad de medios de comunicación online**