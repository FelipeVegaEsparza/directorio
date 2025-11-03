Quiero crear un sitio web donde se reúnan todas las radios y canales de TV online de mis clientes, y también otros medios que quieran unirse libremente.
Cada medio tendrá su página individual (perfil) con su logo, reproductor en vivo, descripción, redes sociales, ubicación y programación.
El sitio debe tener un backend administrativo para que yo (administrador) pueda agregar, editar o eliminar radios/canales fácilmente.
________________________________________
⚙️ Requerimientos funcionales
FRONTEND (sitio público)
•	Página principal con:
o	Un buscador y filtro por nombre, país o categoría (radio, TV, música, noticias, cristiana, etc.)
o	Lista o cuadrícula de radios y canales destacados.
o	Secciones de “Radios Nuevas”, “Más Populares” y “TV Online”.
o	Diseño moderno, rápido y adaptable (responsive).
•	Página de perfil individual para cada radio/canal:
o	Logo e imagen de portada.
o	Reproductor HTML5 de audio o video embebido (según tipo).
o	Nombre, descripción, país/ciudad.
o	Enlaces a redes sociales.
o	Horarios o parrilla de programación (opcional).
o	Botón para escuchar/ver en vivo.
•	Formulario para solicitar unirse (los interesados pueden enviar sus datos y su streaming URL).
•	Footer con contacto, enlaces a redes y créditos (by Hover.cl o Hostreams.com).
BACKEND (panel de administración)
•	Autenticación para el administrador (login).
•	CRUD completo:
o	Agregar/editar/eliminar radios o canales.
o	Campos: nombre, tipo (radio/tv), logo, descripción, URL de streaming, redes sociales, categoría, país, visibilidad.
•	Subida de imágenes (logos y banners).
•	Dashboard con estadísticas (cantidad de radios activas, visitas, reproducciones, etc.).
•	Posibilidad de destacar radios o marcarlas como “verificadas”.
________________________________________
💻 Stack tecnológico:
•	Frontend: React + Next.js + TailwindCSS
•	Backend: Node.js
•	Base de datos: MySQL 
•	Autenticación: JWT
•	Almacenamiento: local
•	Despliegue: compatible con EasyPanel
________________________________________
🎨 Requisitos de diseño
•	Estilo moderno, tipo directorio / catálogo (parecido a TuneIn o Streema).
•	Fondo claro, tipografía limpia, uso de tarjetas con bordes redondeados.
•	Cada radio debe tener su miniatura (logo) y un botón “Escuchar ahora”.
•	Animaciones suaves al pasar el cursor o abrir perfiles.
•	Compatible con dispositivos móviles.
