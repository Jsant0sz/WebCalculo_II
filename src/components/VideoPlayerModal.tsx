import React, { useState, useEffect, useRef } from 'react';
import { VideoItem } from '../types';
import { CartesianCanvas } from './CartesianCanvas';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Check,
  Sparkles,
  Volume2,
  Clock
} from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem | null;
  onUpdateCustomVideo: (videoId: string, url: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  video,
  onUpdateCustomVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'custom'>('player');
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [fileUploadName, setFileUploadName] = useState<string | null>(null);

  // Simulation player state (60 seconds)
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const durationSeconds = 60; // Max 1 minute requirement

  // Auto-play / stop timer
  useEffect(() => {
    if (isOpen && isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, playbackSpeed]);

  // Reset when a new video opens
  useEffect(() => {
    if (isOpen && video) {
      setCurrentTime(0);
      setIsPlaying(true);
      setActiveTab(video.customVideoUrl ? 'custom' : 'player');
    }
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  // Find slide for current time
  const currentSlide =
    [...video.slides].reverse().find((s) => currentTime >= s.time) || video.slides[0];

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputUrl.trim()) {
      onUpdateCustomVideo(video.id, customInputUrl.trim());
      setActiveTab('custom');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFileUploadName(file.name);
      onUpdateCustomVideo(video.id, objectUrl);
      setActiveTab('custom');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#151922] border border-[#343946] rounded-2xl shadow-[0_0_30px_rgba(255,159,67,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#343946] bg-[#0B0D12]/90">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#0B0D12] border border-[#FF9F43]/40 text-[#FF9F43] font-mono text-[11px] font-semibold">
              {video.duration} máx
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#F5F5F5] truncate max-w-md">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B8BEC9] hover:text-[#F5F5F5] hover:bg-[#343946]/40 transition-colors cursor-pointer"
            aria-label="Cerrar reproductor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Micro-Lecture Simulator vs User Video Player */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#0B0D12] border-b border-[#343946] text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-[#FF9F43]/15 text-[#FF9F43] font-semibold border border-[#FF9F43]/40'
                  : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
              }`}
            >
              Micro-Lección Interactiva (60s)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-[#FF9F43]/15 text-[#FF9F43] font-semibold border border-[#FF9F43]/40'
                  : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
              }`}
            >
              <Upload className="w-3 h-3 text-[#FF9F43]" />
              <span>Insertar / Reproducir Mi Video</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#B8BEC9] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#FF9F43]" />
            <span>Duración: &le; 1 minuto</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#151922]">
          {activeTab === 'player' ? (
            /* Micro-Lecture Simulated Video Player */
            <div className="space-y-4">
              {/* Screen Area */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0B0D12] border border-[#343946] shadow-xl p-4 sm:p-6 min-h-[300px] flex flex-col justify-between">
                {/* Visual Math Demonstration */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 space-y-3">
                    <span className="text-[11px] font-mono text-[#FF9F43] uppercase tracking-widest block">
                      {currentSlide.title}
                    </span>
                    <p className="text-sm sm:text-base text-[#F5F5F5] leading-relaxed font-medium">
                      {currentSlide.text}
                    </p>
                    {currentSlide.formula && (
                      <div className="p-3 rounded-xl bg-[#151922] border border-[#343946] font-mono text-[#FF9F43] text-sm font-bold text-center shadow">
                        {currentSlide.formula}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-7">
                    {currentSlide.visualCode === 'riemann' && (
                      <CartesianCanvas
                        fExpr="4 - x^2"
                        gExpr="x + 2"
                        interval={[-2, 1]}
                        height={220}
                        showRiemannBars={true}
                        riemannBarsCount={Math.max(4, Math.floor(currentTime / 2))}
                        showControls={false}
                        interactiveHover={false}
                      />
                    )}
                    {currentSlide.visualCode === 'limits' && (
                      <CartesianCanvas
                        fExpr="2*x - x^2"
                        gExpr="x^2"
                        interval={[0, 1]}
                        height={220}
                        showRiemannBars={false}
                        highlightIntersections={true}
                        showControls={false}
                        interactiveHover={false}
                      />
                    )}
                    {currentSlide.visualCode === 'crossing' && (
                      <CartesianCanvas
                        fExpr="cos(x)"
                        gExpr="sin(x)"
                        interval={[0, 1.571]}
                        height={220}
                        showRiemannBars={false}
                        highlightIntersections={true}
                        showControls={false}
                        interactiveHover={false}
                      />
                    )}
                  </div>
                </div>

                {/* Simulated Audio Wave Visualizer */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#343946] mt-4">
                  <div className="flex items-center gap-1.5 text-[#B8BEC9] text-xs font-mono">
                    <Volume2 className="w-4 h-4 text-[#FF9F43]" />
                    <span>Locución y Explicación Paso a Paso</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1 h-3">
                    {[40, 75, 20, 90, 60, 30, 85, 45, 100, 65, 30, 80, 50, 95].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-[#FF9F43]' : 'bg-[#343946]'
                        }`}
                        style={{
                          height: isPlaying ? `${(h * ((currentTime % 5) + 1)) / 5}%` : '20%',
                        }}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#343946] space-y-3">
                {/* Scrubber Bar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={durationSeconds}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#FF9F43] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-mono text-[#B8BEC9]">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#FF9F43]">{formatTime(durationSeconds)}</span>
                  </div>
                </div>

                {/* Play, Pause, Speed Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2.5 rounded-xl bg-[#FF9F43] hover:bg-[#FFC078] text-[#0B0D12] font-bold transition-all shadow-[0_0_12px_rgba(255,159,67,0.25)] cursor-pointer"
                      aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }}
                      className="p-2 rounded-xl bg-[#151922] text-[#B8BEC9] hover:text-[#F5F5F5] border border-[#343946] transition-colors cursor-pointer"
                      title="Reiniciar micro-clase"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-[#B8BEC9]">Velocidad:</span>
                    {[1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          playbackSpeed === speed
                            ? 'bg-[#FF9F43]/20 text-[#FF9F43] font-bold border border-[#FF9F43]/40'
                            : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Custom Video Player / Upload Tab */
            <div className="space-y-5">
              {video.customVideoUrl ? (
                /* Native HTML5 Video Player if custom video provided */
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden bg-black border border-[#343946] shadow-xl">
                    <video
                      src={video.customVideoUrl}
                      controls
                      autoPlay
                      className="w-full max-h-[380px] object-contain"
                    >
                      Tu navegador no soporta la reproducción de video HTML5.
                    </video>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#B8BEC9]">
                    <span>
                      Reproduciendo video personalizado {fileUploadName ? `(${fileUploadName})` : ''}
                    </span>
                    <button
                      onClick={() => onUpdateCustomVideo(video.id, '')}
                      className="text-rose-400 hover:underline cursor-pointer"
                    >
                      Eliminar video personalizado
                    </button>
                  </div>
                </div>
              ) : (
                /* Insert Form */
                <div className="p-6 rounded-2xl bg-[#0B0D12] border border-[#343946] space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F5] mb-0.5">
                      Inserta tu Video (Máximo 1 Minuto)
                    </h4>
                    <p className="text-xs text-[#B8BEC9]">
                      Sube un archivo de video grabado (.mp4, .webm) o introduce una URL directa.
                    </p>
                  </div>

                  {/* Option A: Upload Local File */}
                  <div className="p-4 rounded-xl border border-dashed border-[#343946] bg-[#151922] text-center space-y-2">
                    <Upload className="w-6 h-6 text-[#FF9F43] mx-auto" />
                    <div className="text-xs font-semibold text-[#F5F5F5]">
                      Cargar archivo de video local
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="video/mp4,video/webm"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-[#FF9F43] hover:bg-[#FFC078] text-[#0B0D12] font-semibold text-xs transition-colors cursor-pointer shadow-[0_0_12px_rgba(255,159,67,0.2)]"
                    >
                      Seleccionar archivo de video
                    </button>
                  </div>

                  {/* Option B: Enter Direct Video URL */}
                  <form onSubmit={handleCustomUrlSubmit} className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#B8BEC9]">
                      <LinkIcon className="w-3.5 h-3.5 text-[#FF9F43]" />
                      <span>O ingresa la URL de tu video:</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customInputUrl}
                        onChange={(e) => setCustomInputUrl(e.target.value)}
                        placeholder="https://ejemplo.edu/mi-video-calculo.mp4"
                        className="flex-1 bg-[#151922] border border-[#343946] rounded-lg px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF9F43]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#FF9F43] text-[#0B0D12] font-bold text-xs hover:bg-[#FFC078] cursor-pointer"
                      >
                        Insertar video
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
