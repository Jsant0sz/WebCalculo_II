import React from 'react';
import { AcademicData } from '../types';
import { GraduationCap, BookOpen, Sigma, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  academicData: AcademicData;
  onOpenAcademicModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  academicData,
  onOpenAcademicModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#040612] text-slate-400 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Platform & Formula */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-base shadow-[0_0_12px_rgba(0,245,212,0.3)]">
                ∫
              </div>
              <span className="font-extrabold tracking-wider text-white text-base">
                ÁREA ENTRE FUNCIONES
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Minicurso interactivo de Cálculo Integral. Cálculo de áreas entre curvas paso a paso.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 font-mono text-cyan-300 text-xs inline-block">
              A = ∫ₐᵇ [ f(x) − g(x) ] dx
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-200 block">
              Secciones del Minicurso
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('inicio')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Inicio y Portada
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('aprende')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Aprende: Teoría y Riemann
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('laboratorio')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Laboratorio Cartesiano
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('videos')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Micro-Clases en Video
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('problemas')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Problemas Resueltos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('practica')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Practica: 5 Retos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Credentials */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Información Académica
              </span>
              <button
                onClick={onOpenAcademicModal}
                className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
              >
                Editar
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-violet-500/20 text-xs space-y-1">
              <div className="text-white font-semibold">{academicData.studentName}</div>
              <div className="text-violet-300 font-mono text-[11px]">Carné: {academicData.studentId}</div>
              <div className="text-slate-400 text-[11px]">{academicData.university}</div>
              <div className="text-slate-400 text-[11px]">{academicData.faculty}</div>
              <div className="text-emerald-400 text-[11px] font-medium pt-1">
                {academicData.course} · {academicData.academicTerm}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} · Minicurso Universitario de Cálculo Integral
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Volver arriba</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
