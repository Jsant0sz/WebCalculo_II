import React, { useState, useEffect } from 'react';
import { CartesianCanvas } from './CartesianCanvas';
import { functionPresets } from '../data/courseData';
import { createFunction, integrateAreaBetween, findIntersections, toPrettyFraction } from '../utils/mathEngine';
import {
  FunctionSquare,
  Compass,
  Calculator,
  RefreshCw,
  Info
} from 'lucide-react';

export const GraphLab: React.FC = () => {
  const [fInput, setFInput] = useState<string>('4 - x^2');
  const [gInput, setGInput] = useState<string>('x + 2');
  const [limitA, setLimitA] = useState<number>(-2);
  const [limitB, setLimitB] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<string>('parabola-recta');
  const [showRiemann, setShowRiemann] = useState<boolean>(false);
  const [riemannBars, setRiemannBars] = useState<number>(14);

  const [computedArea, setComputedArea] = useState<number>(4.5);
  const [roots, setRoots] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const f = createFunction(fInput);
    const g = createFunction(gInput);

    const detected = findIntersections(f, g, -6, 6);
    setRoots(detected);

    const result = integrateAreaBetween(f, g, limitA, limitB);
    setComputedArea(result.area);
  }, [fInput, gInput, limitA, limitB]);

  const handleSelectPreset = (presetId: string) => {
    const preset = functionPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPreset(preset.id);
    setFInput(preset.fExpr);
    setGInput(preset.gExpr);
    setLimitA(preset.suggestedInterval[0]);
    setLimitB(preset.suggestedInterval[1]);
  };

  const handleAutoDetectRoots = () => {
    const f = createFunction(fInput);
    const g = createFunction(gInput);
    const detected = findIntersections(f, g, -8, 8);
    if (detected.length >= 2) {
      setLimitA(detected[0].x);
      setLimitB(detected[detected.length - 1].x);
    }
  };

  return (
    <section id="laboratorio" className="py-16 bg-[#0B0D12] relative border-t border-[#343946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
            <Compass className="w-3.5 h-3.5" />
            <span>LABORATORIO INTERACTIVO</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F5F5F5]">
            Gráfica Interactiva
          </h2>
          <p className="text-sm text-[#B8BEC9]">
            Cambia las funciones f(x) y g(x) y observa cómo cambia la región sombreada en tiempo real.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {functionPresets.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF9F43]/15 border-[#FF9F43]/40 text-[#FF9F43] shadow-sm'
                    : 'bg-[#151922] border-[#343946] text-[#B8BEC9] hover:text-[#F5F5F5]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* 2-Column Interface: Controls + Live Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4 bg-[#151922] border border-[#343946] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#343946]">
              <div className="flex items-center gap-2">
                <FunctionSquare className="w-4 h-4 text-[#FF9F43]" />
                <h3 className="text-xs font-bold text-[#F5F5F5]">Funciones y Límites</h3>
              </div>
              <button
                onClick={handleAutoDetectRoots}
                className="text-[11px] font-mono text-[#FF9F43] hover:text-[#FFC078] flex items-center gap-1 cursor-pointer"
                title="Ajustar límites a los cortes"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto-cortes</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs font-medium text-[#FF9F43] mb-1">
                  <span>Curva Superior f(x)</span>
                  <span className="text-[10px] text-[#B8BEC9] font-mono">Naranja</span>
                </label>
                <input
                  type="text"
                  value={fInput}
                  onChange={(e) => {
                    setFInput(e.target.value);
                    setSelectedPreset('');
                  }}
                  className="w-full bg-[#0B0D12] border border-[#343946] rounded-xl px-3 py-1.5 text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#FF9F43]"
                  placeholder="ej. 4 - x^2"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-medium text-[#F5F5F5] mb-1">
                  <span>Curva Inferior g(x)</span>
                  <span className="text-[10px] text-[#B8BEC9] font-mono">Blanco</span>
                </label>
                <input
                  type="text"
                  value={gInput}
                  onChange={(e) => {
                    setGInput(e.target.value);
                    setSelectedPreset('');
                  }}
                  className="w-full bg-[#0B0D12] border border-[#343946] rounded-xl px-3 py-1.5 text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#FF9F43]"
                  placeholder="ej. x + 2"
                />
              </div>
            </div>

            {/* Limits */}
            <div className="pt-2 border-t border-[#343946]">
              <span className="text-xs font-semibold text-[#F5F5F5] block mb-2">
                Límites [a, b]
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#B8BEC9] font-mono block mb-0.5">a (inferior)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={limitA}
                    onChange={(e) => setLimitA(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0D12] border border-[#343946] rounded-lg px-2 py-1 text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#FF9F43]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#B8BEC9] font-mono block mb-0.5">b (superior)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={limitB}
                    onChange={(e) => setLimitB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0D12] border border-[#343946] rounded-lg px-2 py-1 text-xs font-mono text-[#F5F5F5] focus:outline-none focus:border-[#FF9F43]"
                  />
                </div>
              </div>
            </div>

            {/* Riemann toggles */}
            <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#343946] space-y-2">
              <label className="text-xs text-[#F5F5F5] flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRiemann}
                  onChange={(e) => setShowRiemann(e.target.checked)}
                  className="accent-[#FF9F43] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Mostrar rectángulos de Riemann (dA)</span>
              </label>

              {showRiemann && (
                <div className="space-y-1 pt-1.5 border-t border-[#343946]">
                  <div className="flex justify-between text-[11px] font-mono text-[#B8BEC9]">
                    <span>Partición n:</span>
                    <span className="text-[#FF9F43] font-bold">{riemannBars} barras</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={30}
                    step={2}
                    value={riemannBars}
                    onChange={(e) => setRiemannBars(parseInt(e.target.value))}
                    className="w-full accent-[#FF9F43] cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Calculated Area */}
            <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#343946]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF9F43] mb-0.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Área Calculada</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xl font-mono font-bold text-[#FF9F43]">
                    {computedArea.toFixed(3)} u²
                  </div>
                  <span className="text-[11px] text-[#B8BEC9] font-mono">
                    ≈ {toPrettyFraction(computedArea)} u²
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#B8BEC9] font-mono block">Cortes</span>
                  <span className="text-xs font-mono text-[#FFC078]">
                    {roots.length > 0 ? `${roots.length} puntos` : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Display */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-[#151922] border border-[#343946] rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-[#F5F5F5]">
                  Plano Cartesiano
                </span>
                <span className="text-xs font-mono text-[#FF9F43]">
                  [{limitA}, {limitB}]
                </span>
              </div>

              <CartesianCanvas
                fExpr={fInput}
                gExpr={gInput}
                interval={[limitA, limitB]}
                fLabel={`f(x) = ${fInput}`}
                gLabel={`g(x) = ${gInput}`}
                height={350}
                showRiemannBars={showRiemann}
                riemannBarsCount={riemannBars}
                highlightIntersections={true}
                showControls={true}
                interactiveHover={true}
              />

              {roots.length > 0 && (
                <div className="mt-2.5 p-2 rounded-xl bg-[#0B0D12] border border-[#343946] flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[#B8BEC9] flex items-center gap-1 text-[11px]">
                    <Info className="w-3 h-3 text-[#FF9F43]" />
                    <span>Cortes:</span>
                  </span>
                  {roots.map((r, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-[#151922] border border-[#343946] text-[#FF9F43] text-[11px]"
                    >
                      ({r.x}, {r.y})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
