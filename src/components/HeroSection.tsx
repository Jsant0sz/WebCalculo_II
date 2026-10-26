import React, { useState } from 'react';
import { AcademicData } from '../types';
import { CartesianCanvas } from './CartesianCanvas';
import {
  User,
  GraduationCap,
  Building2,
  Edit3,
  Check,
  ChevronRight,
  Layers,
  ArrowDown
} from 'lucide-react';

interface HeroSectionProps {
  academicData: AcademicData;
  onUpdateAcademicData: (data: AcademicData) => void;
  onOpenModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  academicData,
  onUpdateAcademicData,
  onOpenModal,
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempData, setTempData] = useState<AcademicData>(academicData);

  React.useEffect(() => {
    setTempData(academicData);
  }, [academicData]);

  const handleInlineSave = () => {
    onUpdateAcademicData(tempData);
    setIsInlineEditing(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative pt-10 pb-16 overflow-hidden">
      {/* Background Soft Warm Ambient Glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#FF9F43]/05 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#FFC078]/04 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Title & Clear Short Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#151922] border border-[#343946] text-[#FF9F43] text-xs font-mono">
            <span>MINICURSO · CÁLCULO INTEGRAL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F5]">
            Área entre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F5] via-[#FFC078] to-[#FF9F43]">
              Funciones
            </span>
          </h1>

          <p className="text-base text-[#B8BEC9] max-w-xl mx-auto font-light leading-relaxed">
            Aprende a calcular el área encerrada entre dos curvas paso a paso.
            Conoce la fórmula general, cómo hallar los límites y resuelve ejercicios prácticos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => scrollTo('aprende')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF9F43] hover:bg-[#FFC078] text-[#0B0D12] font-bold text-xs shadow-[0_0_15px_rgba(255,159,67,0.22)] transition-all cursor-pointer"
            >
              <span>Ver explicación</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('laboratorio')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1a202c] border border-[#343946] text-[#F5F5F5] font-semibold text-xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#FF9F43]" />
              <span>Probar en el gráfico</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Academic Data + Live Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Academic Card */}
          <div className="lg:col-span-5 bg-[#151922] border border-[#343946] rounded-2xl p-5 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#343946] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0B0D12] border border-[#343946] flex items-center justify-center text-[#FF9F43]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#F5F5F5]">Datos Académicos</h3>
              </div>

              {isInlineEditing ? (
                <button
                  onClick={handleInlineSave}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40 font-medium cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsInlineEditing(true)}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[#0B0D12] text-[#B8BEC9] border border-[#343946] font-medium hover:text-[#FF9F43] hover:border-[#FF9F43]/40 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#343946] flex items-start gap-2.5">
                <User className="w-4 h-4 text-[#FF9F43] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Estudiante / Autor</span>
                  {isInlineEditing ? (
                    <input
                      type="text"
                      value={tempData.studentName}
                      onChange={(e) => setTempData({ ...tempData, studentName: e.target.value })}
                      className="w-full bg-[#151922] border border-[#FF9F43]/50 rounded px-2 py-0.5 text-[#F5F5F5] font-semibold focus:outline-none text-xs mt-0.5"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#F5F5F5] block truncate">
                      {academicData.studentName}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#343946] flex items-start gap-2.5">
                <div className="w-4 h-4 text-[#FF9F43] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ID
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Carné / Matrícula</span>
                  {isInlineEditing ? (
                    <input
                      type="text"
                      value={tempData.studentId}
                      onChange={(e) => setTempData({ ...tempData, studentId: e.target.value })}
                      className="w-full bg-[#151922] border border-[#FF9F43]/50 rounded px-2 py-0.5 text-[#FF9F43] font-mono text-xs mt-0.5"
                    />
                  ) : (
                    <span className="text-xs font-mono font-semibold text-[#FF9F43] block">
                      {academicData.studentId}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#343946] flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#FFC078] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Universidad y Carrera</span>
                  {isInlineEditing ? (
                    <input
                      type="text"
                      value={tempData.university}
                      onChange={(e) => setTempData({ ...tempData, university: e.target.value })}
                      className="w-full bg-[#151922] border border-[#343946] rounded px-2 py-0.5 text-[#F5F5F5] text-xs mt-0.5"
                    />
                  ) : (
                    <span className="text-xs font-medium text-[#F5F5F5] block">
                      {academicData.university}
                    </span>
                  )}
                  <span className="text-[11px] text-[#B8BEC9] block truncate mt-0.5">
                    {academicData.faculty}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#343946]">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Curso</span>
                  <span className="text-xs font-semibold text-[#F5F5F5] block truncate mt-0.5">
                    {academicData.course}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#343946]">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Ciclo</span>
                  <span className="text-xs font-mono text-[#FF9F43] block truncate mt-0.5">
                    {academicData.academicTerm}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#343946] flex items-center justify-between text-[11px] text-[#B8BEC9]">
              <span>Datos guardados en tu navegador</span>
              <button
                onClick={onOpenModal}
                className="text-[#FF9F43] hover:underline font-medium cursor-pointer"
              >
                Formulario completo →
              </button>
            </div>
          </div>

          {/* Hero Live Graph */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-[#151922] border border-[#343946] rounded-2xl p-4 shadow-xl relative">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <span className="text-xs font-bold text-[#F5F5F5] block">
                    Ejemplo Visual: Parábola y Recta
                  </span>
                  <p className="text-[11px] text-[#B8BEC9]">
                    Área sombreada entre f(x) = 4 - x² y g(x) = x + 2 en [-2, 1].
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FF9F43] bg-[#0B0D12] px-2.5 py-1 rounded border border-[#343946]">
                    Área = 4.5 u² (9/2)
                  </span>
                </div>
              </div>

              <CartesianCanvas
                fExpr="4 - x^2"
                gExpr="x + 2"
                interval={[-2, 1]}
                fLabel="f(x) = 4 - x²"
                gLabel="g(x) = x + 2"
                height={290}
                showRiemannBars={false}
                highlightIntersections={true}
                showControls={true}
                interactiveHover={true}
              />

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono text-center">
                <div className="p-2 rounded-lg bg-[#0B0D12] border border-[#343946]">
                  <span className="text-[10px] text-[#B8BEC9] block">Cortes</span>
                  <span className="text-[#FF9F43] font-bold">x = -2, 1</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0B0D12] border border-[#343946]">
                  <span className="text-[10px] text-[#B8BEC9] block">Resta (f - g)</span>
                  <span className="text-[#F5F5F5] font-bold">2 - x - x²</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0B0D12] border border-[#343946]">
                  <span className="text-[10px] text-[#B8BEC9] block">Integral</span>
                  <span className="text-[#FFC078] font-bold">4.5 u²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll link */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => scrollTo('aprende')}
            className="flex items-center gap-1.5 text-[#B8BEC9] hover:text-[#FF9F43] transition-colors text-xs font-mono cursor-pointer"
          >
            <span>Ver fórmula y pasos</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#FF9F43] animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
