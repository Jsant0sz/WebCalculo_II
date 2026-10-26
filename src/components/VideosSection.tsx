import React, { useState } from 'react';
import { VideoItem } from '../types';
import { courseVideosData } from '../data/courseData';
import { VideoPlayerModal } from './VideoPlayerModal';
import { Play, Video, Clock, CheckCircle, Upload } from 'lucide-react';

export const VideosSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(courseVideosData);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleUpdateCustomVideo = (videoId: string, url: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, customVideoUrl: url } : v))
    );
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo((prev) => (prev ? { ...prev, customVideoUrl: url } : null));
    }
  };

  return (
    <section id="videos" className="py-16 bg-[#0B0D12] relative border-t border-[#343946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
            <Video className="w-3.5 h-3.5" />
            <span>VIDEOS DEL MINICURSO</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F5F5F5]">
            Videos Explicativos
          </h2>
          <p className="text-sm text-[#B8BEC9]">
            Tres videos de menos de 1 minuto para repasar los conceptos clave o insertar tus propios videos grabados.
          </p>
        </div>

        {/* Exactly 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((vid, index) => {
            const hasCustom = Boolean(vid.customVideoUrl);
            return (
              <div
                key={vid.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#151922] border border-[#343946] hover:border-[#FF9F43]/40 transition-all overflow-hidden shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full bg-[#0B0D12] overflow-hidden border-b border-[#343946] flex items-center justify-center p-3">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {index === 0 && (
                        <svg className="w-full h-full max-h-32" viewBox="0 0 200 120" fill="none">
                          <line x1="10" y1="90" x2="190" y2="90" stroke="#343946" strokeWidth="1" />
                          <line x1="30" y1="10" x2="30" y2="110" stroke="#343946" strokeWidth="1" />
                          {[
                            { x: 50, w: 12, h: 45 },
                            { x: 65, w: 12, h: 58 },
                            { x: 80, w: 12, h: 65 },
                            { x: 95, w: 12, h: 63 },
                            { x: 110, w: 12, h: 54 },
                            { x: 125, w: 12, h: 38 },
                          ].map((bar, i) => (
                            <rect
                              key={i}
                              x={bar.x}
                              y={90 - bar.h}
                              width={bar.w}
                              height={bar.h}
                              fill="rgba(255, 159, 67, 0.18)"
                              stroke="#FF9F43"
                              strokeWidth="0.8"
                            />
                          ))}
                          <path d="M 40 85 Q 90 20 150 85" stroke="#FF9F43" strokeWidth="2.2" fill="none" />
                          <path d="M 40 90 Q 90 85 150 90" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
                        </svg>
                      )}

                      {index === 1 && (
                        <svg className="w-full h-full max-h-32" viewBox="0 0 200 120" fill="none">
                          <line x1="10" y1="90" x2="190" y2="90" stroke="#343946" strokeWidth="1" />
                          <line x1="100" y1="10" x2="100" y2="110" stroke="#343946" strokeWidth="1" />
                          <path d="M 30 15 Q 100 115 170 15" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                          <line x1="30" y1="85" x2="170" y2="30" stroke="#FF9F43" strokeWidth="2" />
                          <circle cx="56" cy="75" r="3.5" fill="#FF9F43" />
                          <circle cx="145" cy="40" r="3.5" fill="#FF9F43" />
                          <text x="45" y="96" fill="#B8BEC9" fontSize="8" fontFamily="monospace">x = a</text>
                          <text x="135" y="58" fill="#B8BEC9" fontSize="8" fontFamily="monospace">x = b</text>
                        </svg>
                      )}

                      {index === 2 && (
                        <svg className="w-full h-full max-h-32" viewBox="0 0 200 120" fill="none">
                          <line x1="10" y1="60" x2="190" y2="60" stroke="#343946" strokeWidth="1" />
                          <path d="M 20 90 Q 60 10 100 60 T 180 60" stroke="#FF9F43" strokeWidth="2" fill="none" />
                          <path d="M 20 30 Q 60 110 100 60 T 180 60" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                          <circle cx="100" cy="60" r="3.5" fill="#FFC078" />
                          <text x="50" y="52" fill="#FF9F43" fontSize="9" fontWeight="bold">A₁</text>
                          <text x="140" y="52" fill="#F5F5F5" fontSize="9" fontWeight="bold">A₂</text>
                        </svg>
                      )}

                      {/* Play button */}
                      <button
                        onClick={() => handleOpenVideo(vid)}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#FF9F43] hover:bg-[#FFC078] text-[#0B0D12] flex items-center justify-center shadow-[0_0_12px_rgba(255,159,67,0.3)] transition-transform transform group-hover:scale-105 cursor-pointer"
                        aria-label={`Reproducir ${vid.title}`}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#0B0D12]/90 border border-[#343946] text-[#FF9F43] font-mono text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF9F43]" />
                      <span>{vid.duration}</span>
                    </div>

                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#151922] text-[#B8BEC9] text-[10px] font-mono border border-[#343946]">
                      {vid.topic}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#FF9F43] transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-[#B8BEC9] leading-relaxed">
                      {vid.description}
                    </p>

                    <div className="p-2 rounded-lg bg-[#0B0D12] border border-[#343946] text-[11px] text-[#B8BEC9]">
                      <strong className="text-[#FF9F43] block text-[10px] uppercase font-mono">Clave:</strong>
                      <span>{vid.keyTakeaway}</span>
                    </div>

                    {hasCustom && (
                      <div className="text-[11px] font-mono text-[#FF9F43] flex items-center gap-1 pt-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Video personalizado cargado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenVideo(vid)}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF9F43]/15 hover:bg-[#FF9F43]/25 text-[#FF9F43] border border-[#FF9F43]/40 text-xs font-semibold cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ver video</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsPlayerOpen(true);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1a202c] text-[#B8BEC9] border border-[#343946] text-xs font-medium cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#FF9F43]" />
                    <span>Insertar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        video={selectedVideo}
        onUpdateCustomVideo={handleUpdateCustomVideo}
      />
    </section>
  );
};
