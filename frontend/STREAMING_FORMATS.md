# Formatos de Streaming Soportados

## 📺 TV Online

### ✅ Formatos Totalmente Soportados

#### **HLS (.m3u8)** - Recomendado
- **Descripción**: HTTP Live Streaming de Apple
- **Compatibilidad**: Todos los navegadores modernos
- **Ventajas**: Adaptativo, baja latencia, amplia compatibilidad
- **Ejemplo**: `https://ejemplo.com/stream/playlist.m3u8`

#### **MP4 (H.264)**
- **Descripción**: Video MP4 con códec H.264
- **Compatibilidad**: Universal
- **Ventajas**: Excelente compatibilidad
- **Ejemplo**: `https://ejemplo.com/stream.mp4`

#### **WebM**
- **Descripción**: Formato abierto de Google
- **Compatibilidad**: Chrome, Firefox, Edge
- **Ventajas**: Código abierto, buena compresión
- **Ejemplo**: `https://ejemplo.com/stream.webm`

### ⚠️ Formatos con Soporte Limitado

#### **DASH (.mpd)**
- **Compatibilidad**: Requiere librería adicional
- **Estado**: No implementado aún

#### **RTMP**
- **Compatibilidad**: Requiere Flash (obsoleto)
- **Estado**: No soportado

## 📻 Radio Online

### ✅ Formatos Totalmente Soportados

#### **MP3** - Más Compatible
- **Descripción**: MPEG Audio Layer III
- **Compatibilidad**: Universal
- **Bitrate recomendado**: 128-320 kbps
- **Ejemplo**: `https://ejemplo.com/radio.mp3`

#### **AAC** - Mejor Calidad
- **Descripción**: Advanced Audio Coding
- **Compatibilidad**: Excelente
- **Bitrate recomendado**: 64-256 kbps
- **Ejemplo**: `https://ejemplo.com/radio.aac`

#### **OGG**
- **Descripción**: Formato libre de Xiph.Org
- **Compatibilidad**: Firefox, Chrome
- **Ventajas**: Código abierto
- **Ejemplo**: `https://ejemplo.com/radio.ogg`

#### **HLS Audio (.m3u8)**
- **Descripción**: HLS para audio
- **Compatibilidad**: Todos los navegadores modernos
- **Ventajas**: Adaptativo, baja latencia
- **Ejemplo**: `https://ejemplo.com/audio/playlist.m3u8`

## 🔧 Configuración Técnica

### Configuración HLS Optimizada
```javascript
{
  enableWorker: true,        // Usa Web Workers
  lowLatencyMode: true,      // Baja latencia
  backBufferLength: 90       // Buffer de 90 segundos
}
```

### Detección Automática
El reproductor detecta automáticamente:
- Streams HLS por extensión `.m3u8`
- Soporte nativo del navegador
- Fallback a HLS.js cuando es necesario

## 🌐 Compatibilidad por Navegador

| Formato | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| HLS     | ✅ (HLS.js) | ✅ (HLS.js) | ✅ (Nativo) | ✅ (HLS.js) |
| MP4     | ✅     | ✅      | ✅     | ✅   |
| WebM    | ✅     | ✅      | ❌     | ✅   |
| MP3     | ✅     | ✅      | ✅     | ✅   |
| AAC     | ✅     | ✅      | ✅     | ✅   |
| OGG     | ✅     | ✅      | ❌     | ✅   |

## 📋 Recomendaciones

### Para TV en Vivo
1. **Primera opción**: HLS (.m3u8)
2. **Alternativa**: MP4 progresivo
3. **Resolución**: 720p-1080p
4. **Bitrate**: 2-8 Mbps

### Para Radio en Vivo
1. **Primera opción**: MP3 128-320 kbps
2. **Alternativa**: AAC 64-256 kbps
3. **Para mejor calidad**: HLS audio

### Configuración de Servidor
- **CORS**: Permitir acceso desde el dominio
- **HTTPS**: Requerido para autoplay
- **Cache**: Configurar headers apropiados

## 🚨 Solución de Problemas

### Error: "Formato no soportado"
- Verificar que la URL sea accesible
- Comprobar configuración CORS
- Probar con diferentes formatos

### Error: "No se puede reproducir"
- Verificar conexión a internet
- Comprobar que el stream esté activo
- Intentar con HTTPS

### Latencia Alta
- Usar HLS con `lowLatencyMode: true`
- Reducir `backBufferLength`
- Optimizar configuración del servidor