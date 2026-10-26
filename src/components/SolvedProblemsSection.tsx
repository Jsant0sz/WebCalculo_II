import React, { useState } from 'react';
import { SolvedProblem } from '../types';
import { solvedProblemsData } from '../data/courseData';
import { CartesianCanvas } from './CartesianCanvas';
import {
  FileCheck2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const SolvedProblemsSection: React.FC = () => {
  const [problems] = useState<SolvedProblem[]>(solvedProblemsData);
  const [openSolutions, setOpenSolutions] = useState<{ [id: string]: boolean }>({});

  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="problemas" className="py-16 bg-[#0B0D12] relative border-t border-[#343946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>EJERCICIOS RESUELTOS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F5F5F5]">
            Problemas Resueltos
          </h2>
          <p className="text-sm text-[#B8BEC9]">
            Tres ejercicios guiados. Intenta resolverlos por tu cuenta y pulsa "Mostrar solución" para ver el procedimiento.
          </p>
        </div>

        {/* 3 Problems */}
        <div className="space-y-6">
          {problems.map((prob, index) => {
            const isRevealed = Boolean(openSolutions[prob.id]);

            return (
              <div
                key={prob.id}
                className="rounded-2xl bg-[#151922] border border-[#343946] hover:border-[#FF9F43]/40 transition-all overflow-hidden shadow-lg"
              >
                {/* Problem Header */}
                <div className="p-5 bg-[#0B0D12] border-b border-[#343946] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-[#151922] border border-[#FF9F43]/40 text-[#FF9F43] font-mono text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-mono text-[#FF9F43]">
                        {prob.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          prob.level === 'Básico'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : prob.level === 'Intermedio'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {prob.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F5F5F5]">{prob.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleSolution(prob.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                      isRevealed
                        ? 'bg-[#151922] text-[#F5F5F5] border border-[#343946] hover:border-[#FF9F43]/40'
                        : 'bg-[#FF9F43] text-[#0B0D12] hover:bg-[#FFC078] shadow-[0_0_12px_rgba(255,159,67,0.25)]'
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ocultar solución</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mostrar solución</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Statement */}
                <div className="p-5 space-y-2">
                  <div className="text-sm text-[#F5F5F5] font-medium leading-relaxed">
                    {prob.statement}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#B8BEC9]">
                    <span className="text-[#FF9F43] font-semibold">{prob.fLabel}</span>
                    <span>·</span>
                    <span className="text-[#CBD5E1] font-semibold">{prob.gLabel}</span>
                    <span>·</span>
                    <span>[{prob.interval[0]}, {prob.interval[1]}]</span>
                  </div>
                </div>

                {/* Hidden / Revealed Solution */}
                {isRevealed && (
                  <div className="p-5 pt-0 border-t border-[#343946] bg-[#0B0D12] space-y-5 animate-fadeIn">
                    <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Step by step */}
                      <div className="lg:col-span-7 space-y-3">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#B8BEC9] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#FF9F43]" />
                            <span>Procedimiento:</span>
                          </span>
                          <span className="text-[#FF9F43] font-bold">
                            {prob.areaExact}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {prob.steps.map((st) => (
                            <div
                              key={st.stepNumber}
                              className="p-3.5 rounded-xl bg-[#151922] border border-[#343946] space-y-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-[#0B0D12] border border-[#FF9F43]/40 text-[#FF9F43] font-mono text-[10px] font-bold flex items-center justify-center">
                                  {st.stepNumber}
                                </span>
                                <h4 className="text-xs font-bold text-[#F5F5F5]">{st.title}</h4>
                              </div>

                              <p className="text-xs text-[#B8BEC9] pl-6 leading-relaxed">
                                {st.description}
                              </p>

                              {st.formula && (
                                <div className="ml-6 p-2 rounded-lg bg-[#0B0D12] border border-[#343946] font-mono text-[#FF9F43] text-xs">
                                  {st.formula}
                                </div>
                              )}

                              {st.detail && (
                                <p className="text-[11px] text-[#B8BEC9] pl-6 font-mono">
                                  {st.detail}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Result card */}
                        <div className="p-3 rounded-xl bg-[#151922] border border-emerald-500/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-emerald-300">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Resultado final verificado</span>
                          </div>
                          <span className="font-mono font-bold text-[#FF9F43]">
                            {prob.areaExact}
                          </span>
                        </div>
                      </div>

                      {/* Graph */}
                      <div className="lg:col-span-5 space-y-2">
                        <div className="p-3 bg-[#151922] rounded-xl border border-[#343946]">
                          <span className="text-xs font-bold text-[#F5F5F5] block mb-2">
                            Gráfica del ejercicio
                          </span>

                          <CartesianCanvas
                            fExpr={prob.fExpr}
                            gExpr={prob.gExpr}
                            interval={prob.interval}
                            fLabel={prob.fLabel}
                            gLabel={prob.gLabel}
                            height={240}
                            showRiemannBars={false}
                            highlightIntersections={true}
                            showControls={true}
                          />

                          <div className="mt-2 text-[11px] font-mono text-[#B8BEC9] flex justify-between">
                            <span>Puntos de corte:</span>
                            <span className="text-[#FF9F43]">
                              {prob.intersectionPoints.map((p) => `(${p.x}, ${p.y})`).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
