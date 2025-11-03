# Documento de Requerimientos - Directorio de Radios y TV Online

## Introducción

Este proyecto consiste en desarrollar una plataforma web que funcione como directorio centralizado para radios y canales de TV online. La plataforma permitirá a los medios de comunicación tener su propia página de perfil con reproductor en vivo, información detallada y enlaces a redes sociales. Incluirá un sistema de administración backend para gestionar todos los medios de forma centralizada.

## Requerimientos

### Requerimiento 1 - Página Principal del Directorio

**Historia de Usuario:** Como visitante del sitio, quiero poder navegar y descubrir radios y canales de TV fácilmente, para encontrar contenido de mi interés.

#### Criterios de Aceptación

1. CUANDO un usuario accede a la página principal ENTONCES el sistema DEBERÁ mostrar un buscador prominente
2. CUANDO un usuario utiliza el buscador ENTONCES el sistema DEBERÁ filtrar por nombre, país o categoría
3. CUANDO la página se carga ENTONCES el sistema DEBERÁ mostrar secciones de "Radios Nuevas", "Más Populares" y "TV Online"
4. CUANDO un usuario accede desde dispositivo móvil ENTONCES el sistema DEBERÁ mostrar un diseño responsive
5. CUANDO un usuario navega por las categorías ENTONCES el sistema DEBERÁ permitir filtrar por radio, TV, música, noticias, cristiana, etc.

### Requerimiento 2 - Perfiles Individuales de Medios

**Historia de Usuario:** Como oyente/espectador, quiero acceder a una página dedicada de cada radio o canal, para obtener información completa y reproducir contenido en vivo.

#### Criterios de Aceptación

1. CUANDO un usuario accede al perfil de un medio ENTONCES el sistema DEBERÁ mostrar logo e imagen de portada
2. CUANDO un usuario está en el perfil ENTONCES el sistema DEBERÁ incluir un reproductor HTML5 funcional
3. CUANDO se carga el perfil ENTONCES el sistema DEBERÁ mostrar nombre, descripción y ubicación geográfica
4. CUANDO un usuario ve el perfil ENTONCES el sistema DEBERÁ mostrar enlaces a redes sociales del medio
5. SI el medio tiene programación ENTONCES el sistema DEBERÁ mostrar horarios o parrilla
6. CUANDO un usuario hace clic en "Escuchar/Ver en vivo" ENTONCES el sistema DEBERÁ iniciar la reproducción

### Requerimiento 3 - Sistema de Solicitudes de Adhesión

**Historia de Usuario:** Como propietario de un medio, quiero poder solicitar que mi radio o canal sea incluido en el directorio, para ampliar mi audiencia.

#### Criterios de Aceptación

1. CUANDO un medio quiere unirse ENTONCES el sistema DEBERÁ proporcionar un formulario de solicitud
2. CUANDO se envía una solicitud ENTONCES el sistema DEBERÁ capturar datos del medio y URL de streaming
3. CUANDO se completa el formulario ENTONCES el sistema DEBERÁ enviar la información al administrador
4. CUANDO se envía una solicitud ENTONCES el sistema DEBERÁ mostrar confirmación al solicitante

### Requerimiento 4 - Panel de Administración

**Historia de Usuario:** Como administrador del sitio, quiero gestionar todos los medios desde un panel centralizado, para mantener el directorio actualizado y organizado.

#### Criterios de Aceptación

1. CUANDO el administrador accede al panel ENTONCES el sistema DEBERÁ requerir autenticación JWT
2. CUANDO el administrador está autenticado ENTONCES el sistema DEBERÁ permitir agregar nuevos medios
3. CUANDO se gestiona un medio ENTONCES el sistema DEBERÁ permitir editar nombre, tipo, logo, descripción, URL, redes sociales, categoría, país y visibilidad
4. CUANDO el administrador lo requiera ENTONCES el sistema DEBERÁ permitir eliminar medios
5. CUANDO se suben archivos ENTONCES el sistema DEBERÁ manejar logos y banners localmente
6. CUANDO el administrador accede al dashboard ENTONCES el sistema DEBERÁ mostrar estadísticas de radios activas, visitas y reproducciones

### Requerimiento 5 - Funcionalidades de Destacado y Verificación

**Historia de Usuario:** Como administrador, quiero poder destacar ciertos medios y marcarlos como verificados, para mejorar la experiencia del usuario y la credibilidad del directorio.

#### Criterios de Aceptación

1. CUANDO el administrador selecciona un medio ENTONCES el sistema DEBERÁ permitir marcarlo como destacado
2. CUANDO un medio es destacado ENTONCES el sistema DEBERÁ mostrarlo prominentemente en la página principal
3. CUANDO el administrador lo determine ENTONCES el sistema DEBERÁ permitir marcar medios como "verificados"
4. CUANDO un medio está verificado ENTONCES el sistema DEBERÁ mostrar una insignia de verificación

### Requerimiento 6 - Diseño y Experiencia de Usuario

**Historia de Usuario:** Como usuario del sitio, quiero una interfaz moderna y fácil de usar, para navegar cómodamente desde cualquier dispositivo.

#### Criterios de Aceptación

1. CUANDO un usuario navega el sitio ENTONCES el sistema DEBERÁ usar un diseño tipo directorio/catálogo
2. CUANDO se muestran los medios ENTONCES el sistema DEBERÁ usar tarjetas con bordes redondeados
3. CUANDO un usuario interactúa con elementos ENTONCES el sistema DEBERÁ mostrar animaciones suaves
4. CUANDO se accede desde móvil ENTONCES el sistema DEBERÁ ser completamente responsive
5. CUANDO se carga cualquier página ENTONCES el sistema DEBERÁ usar fondo claro y tipografía limpia

### Requerimiento 7 - Infraestructura Técnica

**Historia de Usuario:** Como desarrollador/administrador del sistema, quiero que la plataforma use tecnologías modernas y sea fácil de desplegar, para garantizar mantenibilidad y escalabilidad.

#### Criterios de Aceptación

1. CUANDO se desarrolla el frontend ENTONCES el sistema DEBERÁ usar React + Next.js + TailwindCSS
2. CUANDO se desarrolla el backend ENTONCES el sistema DEBERÁ usar Node.js
3. CUANDO se almacenan datos ENTONCES el sistema DEBERÁ usar MySQL como base de datos
4. CUANDO se maneja autenticación ENTONCES el sistema DEBERÁ usar JWT
5. CUANDO se almacenan archivos ENTONCES el sistema DEBERÁ usar almacenamiento local
6. CUANDO se despliega ENTONCES el sistema DEBERÁ ser compatible con EasyPanel