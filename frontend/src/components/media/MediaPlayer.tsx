'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import { cn, formatDuration } from '@/utils';
import { PlayerProps, PlayerState } from '@/types';
import { Card, Button, Loading, CountryFlag } from '@/components/ui';
import { apiClient } from '@/lib/api';
import Hls from 'hls.js';

const MediaPlayer: React.FC<PlayerProps> = ({
  media,
  autoplay = false,
  onPlay,
  onPause,
  onError,
}) => {
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hasAutoPlayed = useRef(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    volume: 1,
    muted: false,
    currentTime: 0,
    duration: 0,
    loading: false,
    error: undefined,
  });

  const isVideo = media.type === 'tv';
  const mediaRef = isVideo ? videoRef : audioRef;
  const isHLS = media.streamUrl.includes('.m3u8');

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    // Reset autoplay flag when stream URL changes
    hasAutoPlayed.current = false;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, loading: true, error: undefined }));
    };

    const handleCanPlay = () => {
      setPlayerState(prev => ({ ...prev, loading: false }));
    };

    const handleTimeUpdate = () => {
      if (mediaElement) {
        setPlayerState(prev => ({
          ...prev,
          currentTime: mediaElement.currentTime,
          duration: mediaElement.duration || 0,
        }));
      }
    };

    const handleError = (event: any) => {
      let errorMessage = 'Error al cargar el stream. ';
      
      if (mediaElement?.error) {
        switch (mediaElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage += 'Reproducción abortada.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage += 'Error de red. Verifica tu conexión.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage += 'Error de decodificación. Formato no soportado.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage += 'Formato de stream no soportado o URL inválida.';
            break;
          default:
            errorMessage += 'Error desconocido.';
        }
      } else {
        errorMessage += 'Verifica la URL o intenta más tarde.';
      }
      
      setPlayerState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        isPlaying: false 
      }));
      if (onError) {
        onError(errorMessage);
      }
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    // Setup HLS for .m3u8 streams
    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: false,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1,
          capLevelToPlayerSize: true,
          xhrSetup: (xhr: XMLHttpRequest, url: string) => {
            xhr.withCredentials = false;
          }
        });
        
        hlsRef.current = hls;
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(media.streamUrl);
        });
        
        hls.on(Hls.Events.MANIFEST_LOADING, () => {
          setPlayerState(prev => ({ ...prev, loading: true, error: undefined }));
        });
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setPlayerState(prev => ({ ...prev, loading: false }));
          
          // If autoplay was requested, start playing now that manifest is ready
          if (autoplay && !hasAutoPlayed.current) {
            hasAutoPlayed.current = true;
            setTimeout(() => {
              handlePlay();
            }, 100);
          }
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            let errorMessage = 'Error al cargar el stream HLS: ';
            
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                errorMessage += `Error de red (${data.details}). `;
                if (data.response?.code === 0) {
                  errorMessage += 'Posible problema de CORS o URL inaccesible.';
                } else {
                  errorMessage += 'Verifica tu conexión a internet.';
                }
                // Try to recover
                hls.startLoad();
                return;
                
              case Hls.ErrorTypes.MEDIA_ERROR:
                errorMessage += `Error de media (${data.details}). Intentando recuperar...`;
                hls.recoverMediaError();
                return;
                
              default:
                errorMessage += `Error fatal (${data.type}: ${data.details}).`;
                break;
            }
            
            setPlayerState(prev => ({ 
              ...prev, 
              loading: false, 
              error: errorMessage,
              isPlaying: false 
            }));
            if (onError) onError(errorMessage);
          }
        });
        
        hls.attachMedia(mediaElement);
        
      } else if (mediaElement.canPlayType && mediaElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        mediaElement.src = media.streamUrl;
      } else {
        setPlayerState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Tu navegador no soporta streams HLS (.m3u8). Intenta con Chrome, Firefox o Safari.',
          isPlaying: false 
        }));
      }
    } else {
      // Regular media handling
      mediaElement.src = media.streamUrl;
    }

    mediaElement.addEventListener('loadstart', handleLoadStart);
    mediaElement.addEventListener('canplay', handleCanPlay);
    mediaElement.addEventListener('timeupdate', handleTimeUpdate);
    mediaElement.addEventListener('error', handleError);
    mediaElement.addEventListener('ended', handleEnded);

    return () => {
      mediaElement.removeEventListener('loadstart', handleLoadStart);
      mediaElement.removeEventListener('canplay', handleCanPlay);
      mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
      mediaElement.removeEventListener('error', handleError);
      mediaElement.removeEventListener('ended', handleEnded);
      
      // Cleanup HLS
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [media.streamUrl, onError, isHLS, isVideo]);

  // Separate useEffect for autoplay - only runs once when component mounts
  useEffect(() => {
    if (autoplay && !hasAutoPlayed.current && !isHLS) {
      // For non-HLS streams, autoplay immediately
      hasAutoPlayed.current = true;
      const timer = setTimeout(() => {
        handlePlay();
      }, 100);
      return () => clearTimeout(timer);
    }
    // For HLS streams, autoplay is handled in MANIFEST_PARSED event
  }, [autoplay, isHLS]);

  const handlePlay = async () => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    try {
      setPlayerState(prev => ({ ...prev, loading: true, error: undefined }));
      
      // For HLS streams, check if manifest is loaded
      if (isHLS && hlsRef.current) {
        const hls = hlsRef.current;
        
        // If manifest is not loaded yet, wait for it
        if (hls.levels.length === 0) {
          // Wait for manifest to be parsed
          const waitForManifest = new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout esperando el manifest HLS'));
            }, 10000);
            
            const onManifestParsed = () => {
              clearTimeout(timeout);
              hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
              hls.off(Hls.Events.ERROR, onError);
              resolve();
            };
            
            const onError = (event: any, data: any) => {
              if (data.fatal) {
                clearTimeout(timeout);
                hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
                hls.off(Hls.Events.ERROR, onError);
                reject(new Error(`Error HLS: ${data.details}`));
              }
            };
            
            hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
            hls.on(Hls.Events.ERROR, onError);
          });
          
          await waitForManifest;
        }
      } else if (!isHLS) {
        mediaElement.load();
      }
      
      await mediaElement.play();
      setPlayerState(prev => ({ ...prev, isPlaying: true, loading: false }));
      
      // Track play event only once per session
      if (!hasTrackedPlay) {
        try {
          await apiClient.post(`/api/stats/play/${media.id}`, {
            eventType: 'play'
          });
          setHasTrackedPlay(true);
        } catch (err) {
          // Silently fail stats tracking
        }
      }
      
      if (onPlay) onPlay();
    } catch (error) {
      const errorMessage = `No se pudo reproducir el stream: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      setPlayerState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        isPlaying: false 
      }));
      if (onError) onError(errorMessage);
    }
  };

  const handlePause = () => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    mediaElement.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
    if (onPause) onPause();
  };

  const handleVolumeChange = (newVolume: number) => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    mediaElement.volume = newVolume;
    setPlayerState(prev => ({ 
      ...prev, 
      volume: newVolume,
      muted: newVolume === 0 
    }));
  };

  const handleMuteToggle = () => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    const newMuted = !playerState.muted;
    mediaElement.muted = newMuted;
    setPlayerState(prev => ({ ...prev, muted: newMuted }));
  };

  const handleSeek = (newTime: number) => {
    const mediaElement = mediaRef.current;
    if (!mediaElement || !isFinite(mediaElement.duration)) return;

    mediaElement.currentTime = newTime;
    setPlayerState(prev => ({ ...prev, currentTime: newTime }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Media Info */}
        <div className="flex items-center space-x-4">
          {media.logoUrl && (
            <img
              src={media.logoUrl}
              alt={media.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-secondary-900 truncate">
              {media.name}
            </h3>
            <div className="flex items-center space-x-2 text-secondary-600 text-sm">
              <span>{media.type === 'radio' ? '📻 Radio' : '📺 TV'}</span>
              {media.country && (
                <>
                  <span>•</span>
                  <CountryFlag country={media.country} size="sm" />
                  <span>{media.country}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Video Player (for TV) */}
        {isVideo && (
          <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
            <video
              ref={videoRef}
              {...(!isHLS && { src: media.streamUrl })}
              className="w-full h-full"
              controls={playerState.isPlaying}
              playsInline
              muted={playerState.muted}
              crossOrigin="anonymous"
            />
            {!playerState.isPlaying && !playerState.loading && !playerState.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  disabled={isHLS && hlsRef.current?.levels.length === 0}
                >
                  <PlayIcon className="w-8 h-8" />
                </Button>
              </div>
            )}
            
            {/* HLS Loading Indicator */}
            {isHLS && hlsRef.current?.levels.length === 0 && !playerState.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center text-white">
                  <Loading size="md" />
                  <p className="mt-2 text-sm">Cargando stream...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audio Player (for Radio) */}
        {!isVideo && (
          <audio
            ref={audioRef}
            {...(!isHLS && { src: media.streamUrl })}
            preload="metadata"
            crossOrigin="anonymous"
          />
        )}

        {/* Error State */}
        {playerState.error && (
          <div className="flex items-center space-x-3 p-4 bg-error-50 border border-error-200 rounded-xl">
            <ExclamationTriangleIcon className="w-5 h-5 text-error-500 flex-shrink-0" />
            <p className="text-error-700 text-sm">{playerState.error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4">
            {playerState.loading ? (
              <Loading size="md" />
            ) : (
              <Button
                onClick={playerState.isPlaying ? handlePause : handlePlay}
                size="lg"
                disabled={!!playerState.error}
                className="w-14 h-14 rounded-full"
              >
                {playerState.isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </Button>
            )}
          </div>

          {/* Progress Bar (only for non-live streams) */}
          {playerState.duration > 0 && isFinite(playerState.duration) && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-secondary-500 w-12 text-right">
                  {formatDuration(playerState.currentTime)}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={playerState.duration}
                    value={playerState.currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <span className="text-xs text-secondary-500 w-12">
                  {formatDuration(playerState.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Volume Control */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handleMuteToggle}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {playerState.muted || playerState.volume === 0 ? (
                <SpeakerXMarkIcon className="w-5 h-5" />
              ) : (
                <SpeakerWaveIcon className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1 max-w-32">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={playerState.muted ? 0 : playerState.volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Live Indicator */}
        {playerState.isPlaying && (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 px-3 py-1 bg-error-100 text-error-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-error-500 rounded-full animate-pulse"></div>
              <span className="font-medium">EN VIVO</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Card>
  );
};

export default MediaPlayer;