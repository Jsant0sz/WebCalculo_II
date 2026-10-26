import React, { useState } from 'react';
import { PracticeExercise } from '../types';
import { practiceExercisesData } from '../data/courseData';
import { verifyAnswer } from '../utils/mathEngine';
import { CartesianCanvas } from './CartesianCanvas';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const PracticeSection: React.FC = () => {
  const [exercises] = useState<PracticeExercise[]>(practiceExercisesData);

  const [userInputs, setUserInputs] = useState<{ [id: string]: string }>({});
  const [feedback, setFeedback] = useState<{
    [id: string]: { isCorrect: boolean; message: string; checked: boolean };
  }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{ [id: string]: boolean }>({});
  const [revealedHints, setRevealedHints] = useState<{ [id: string]: boolean }>({});
  const [revealedGraphs, setRevealedGraphs] = useState<{ [id: string]: boolean }>({});

  const solvedCount = Object.values(feedback).filter((f) => f.checked && f.isCorrect).length;

  const handleInputChange = (id: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: value }));
    if (feedback[id]?.checked) {
      setFeedback((prev) => ({ ...prev, [id]: { ...prev[id], checked: false } }));
    }
  };

  const handleCheckAnswer = (exercise: PracticeExercise) => {
    const input = userInputs[exercise.id] || '';
    const result = verifyAnswer(input, exercise.decimalValue, exercise.acceptedAnswers);

    setFeedback((prev) => ({
      ...prev,
      [exercise.id]: {
        isCorrect: result.isCorrect,
        message: result.feedback,
        checked: true,
      },
    }));

    if (result.isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FF9F43', '#FFC078', '#F5F5F5', '#343946'],
        });
      } catch {
        // ignore
      }
    }
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHint = (id: string) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGraph = (id: string) => {
    setRevealedGraphs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetAll = () => {
    setUserInputs({});
    setFeedback({});
    setRevealedSolutions({});
    setRevealedHints({});
    setRevealedGraphs({});
  };

  return (
    <section id="practica" className="py-16 bg-[#0B0D12] relative border-t border-[#343946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
            <Trophy className="w-3.5 h-3.5" />
            <span>EJERCICIOS PROPUESTOS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F5F5F5]">
            Practica: 5 Retos
          </h2>
          <p className="text-sm text-[#B8BEC9]">
            Resuelve los ejercicios, escribe tu respuesta en fracción (ej: <span className="font-mono text-[#FF9F43]">32/3</span>) o decimal (ej: <span className="font-mono text-[#FF9F43]">10.67</span>) y compruébala.
          </p>
        </div>

        {/* Progress Card */}
        <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-[#151922] border border-[#343946] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B0D12] border border-[#FF9F43]/40 flex items-center justify-center text-[#FF9F43] font-bold font-mono text-xs">
              {solvedCount}/5
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F5F5] block">Progreso</span>
              <span className="text-[11px] text-[#B8BEC9]">
                {solvedCount === 5
                  ? '¡Excelente! Has resuelto todos los ejercicios.'
                  : `${solvedCount} de 5 correctos.`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32 bg-[#0B0D12] border border-[#343946] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF9F43] to-[#FFC078] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(solvedCount / 5) * 100}%` }}
              ></div>
            </div>

            {solvedCount > 0 && (
              <button
                onClick={handleResetAll}
                className="text-[11px] text-[#B8BEC9] hover:text-[#F5F5F5] flex items-center gap-1 cursor-pointer transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Exercises */}
        <div className="space-y-6">
          {exercises.map((ex) => {
            const fb = feedback[ex.id];
            const isSolutionOpen = Boolean(revealedSolutions[ex.id]);
            const isHintOpen = Boolean(revealedHints[ex.id]);
            const isGraphOpen = Boolean(revealedGraphs[ex.id]);
            const currentInput = userInputs[ex.id] || '';

            return (
              <div
                key={ex.id}
                className={`rounded-2xl bg-[#151922] border transition-all overflow-hidden shadow-lg ${
                  fb?.checked && fb.isCorrect
                    ? 'border-emerald-500/40'
                    : 'border-[#343946] hover:border-[#FF9F43]/40'
                }`}
              >
                {/* Header */}
                <div className="p-4 bg-[#0B0D12] border-b border-[#343946] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#151922] border border-[#FF9F43]/40 text-[#FF9F43] font-mono text-xs font-bold flex items-center justify-center">
                      {ex.number}
                    </span>
                    <div>
                      <span className="text-[11px] font-mono text-[#FF9F43] block">{ex.difficulty}</span>
                      <h3 className="text-sm font-bold text-[#F5F5F5]">{ex.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHint(ex.id)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#151922] hover:bg-[#343946]/50 text-[#B8BEC9] border border-[#343946] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#FF9F43]" />
                      <span>{isHintOpen ? 'Ocultar pista' : 'Pista'}</span>
                    </button>
                    <button
                      onClick={() => toggleGraph(ex.id)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#151922] hover:bg-[#343946]/50 text-[#B8BEC9] border border-[#343946] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isGraphOpen ? 'Ocultar gráfica' : 'Gráfica'}</span>
                    </button>
                  </div>
                </div>

                {/* Statement & Form */}
                <div className="p-5 space-y-4">
                  <div className="text-sm text-[#F5F5F5] font-medium leading-relaxed">
                    {ex.statement}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#B8BEC9]">
                    <span className="text-[#FF9F43] font-semibold">{ex.fLabel}</span>
                    <span>·</span>
                    <span className="text-[#CBD5E1] font-semibold">{ex.gLabel}</span>
                  </div>

                  {/* Hint */}
                  {isHintOpen && (
                    <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#FF9F43]/30 text-xs text-[#F5F5F5] flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-[#FF9F43] shrink-0 mt-0.5" />
                      <span>{ex.hint}</span>
                    </div>
                  )}

                  {/* Graph */}
                  {isGraphOpen && (
                    <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#343946] space-y-1">
                      <CartesianCanvas
                        fExpr={ex.fExpr}
                        gExpr={ex.gExpr}
                        interval={ex.interval}
                        fLabel={ex.fLabel}
                        gLabel={ex.gLabel}
                        height={230}
                        showRiemannBars={false}
                        highlightIntersections={true}
                        showControls={true}
                      />
                    </div>
                  )}

                  {/* Input Form */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => handleInputChange(ex.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckAnswer(ex);
                      }}
                      placeholder="Respuesta (ej: 32/3 o 10.67)"
                      className="flex-1 px-3.5 py-2 bg-[#0B0D12] border border-[#343946] rounded-xl text-xs font-mono text-[#F5F5F5] placeholder-[#B8BEC9]/50 focus:outline-none focus:border-[#FF9F43]"
                    />

                    <button
                      onClick={() => handleCheckAnswer(ex)}
                      className="px-4 py-2 rounded-xl bg-[#FF9F43] hover:bg-[#FFC078] text-[#0B0D12] font-bold text-xs shadow-[0_0_12px_rgba(255,159,67,0.25)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Comprobar</span>
                    </button>

                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#0B0D12] hover:bg-[#151922] text-[#F5F5F5] text-xs font-medium border border-[#343946] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isSolutionOpen ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[#B8BEC9]" />
                          <span>Ocultar solución</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#FF9F43]" />
                          <span>Ver solución</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback */}
                  {fb?.checked && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                        fb.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      {fb.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block font-semibold mb-0.5">
                          {fb.isCorrect ? '¡Correcto!' : 'Inténtalo de nuevo'}
                        </strong>
                        <span>{fb.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Solution */}
                  {isSolutionOpen && (
                    <div className="pt-3 border-t border-[#343946] space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-[#FF9F43] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pasos de la solución:</span>
                        </span>
                        <span className="text-[#FF9F43] font-bold">
                          Área = {ex.exactFraction} u² ≈ {ex.decimalValue.toFixed(2)} u²
                        </span>
                      </div>

                      <div className="space-y-2">
                        {ex.solutionSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-3 rounded-xl bg-[#0B0D12] border border-[#343946] space-y-1 text-xs"
                          >
                            <span className="font-bold text-[#F5F5F5] block">
                              {step.stepNumber}. {step.title}
                            </span>
                            <div className="p-1.5 rounded bg-[#151922] border border-[#343946] font-mono text-[#FF9F43] text-xs">
                              {step.math}
                            </div>
                            <p className="text-[11px] text-[#B8BEC9] font-mono">
                              {step.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
