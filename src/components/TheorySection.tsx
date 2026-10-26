import React, { useState } from 'react';
import { CartesianCanvas } from './CartesianCanvas';
import {
  BookOpen,
  CheckCircle2,
  Sliders,
  Layers,
  Sigma,
  Split,
  ChevronRight
} from 'lucide-react';

export const TheorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fundamento' | 'pasos' | 'casos' | 'riemann'>('fundamento');
  const [riemannBars, setRiemannBars] = useState<number>(10);
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const stepsList = [
    {
      num: 1,
      title: 'Graficar ambas curvas',
      subtitle: 'Visualiza la región',
      desc: 'Dibuja f(x) y g(x) para identificar la forma de la región y confirmar que ambas funciones son continuas en el tramo de interés.',
      tip: 'La gráfica te permite verificar a simple vista cuál función queda por encima.',
      formula: 'y_1 = f(x), \\quad y_2 = g(x)',
    },
    {
      num: 2,
      title: 'Hallar los límites (puntos de corte)',
      subtitle: 'Iguala f(x) = g(x)',
      desc: 'Resuelve la ecuación f(x) - g(x) = 0. Las soluciones reales son los límites de integración x = a y x = b.',
      tip: 'Si no te dan un intervalo en el enunciado, los cortes son los extremos naturales del área.',
      formula: 'f(x) = g(x) \\implies x = a, \\; x = b',
    },
    {
      num: 3,
      title: 'Identificar la curva superior',
      subtitle: 'f_sup(x) ≥ f_inf(x)',
      desc: 'Elige un valor intermedio c entre a y b. La función con mayor valor numérico es la curva superior.',
      tip: 'La altura siempre debe ser positiva: h(x) = y_superior - y_inferior ≥ 0.',
      formula: 'h(x) = f_{\\text{sup}}(x) - f_{\\text{inf}}(x) \\ge 0',
    },
    {
      num: 4,
      title: 'Plantear la integral',
      subtitle: 'Resta superior menos inferior',
      desc: 'El área de cada rectángulo vertical es dA = [f(x) - g(x)] dx. El área total es la integral entre a y b.',
      tip: 'Si las curvas se expresan en función de y, se integran franjas horizontales respecto a dy.',
      formula: 'A = \\int_a^b [f_{\\text{sup}}(x) - f_{\\text{inf}}(x)]\\, dx',
    },
    {
      num: 5,
      title: 'Integrar y evaluar (Regla de Barrow)',
      subtitle: 'Calcula F(b) - F(a)',
      desc: 'Calcula la antiderivada F(x) y evalúa los límites: F(b) - F(a). El resultado debe ser un valor positivo.',
      tip: 'Si obtienes un resultado negativo, restaste las funciones en el orden inverso.',
      formula: 'A = [F(x)]_a^b = F(b) - F(a) > 0',
    },
  ];

  return (
    <section id="aprende" className="py-16 bg-[#0B0D12] relative border-t border-[#343946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TEORÍA ESENCIAL</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#F5F5F5]">
            Cómo Calcular el Área entre Curvas
          </h2>
          <p className="text-sm text-[#B8BEC9]">
            La fórmula general, el procedimiento en 5 pasos y la explicación visual de las sumas de Riemann.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#151922] border border-[#343946] rounded-xl max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('fundamento')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'fundamento'
                ? 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/40 font-semibold shadow-sm'
                : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
            }`}
          >
            Fórmula General
          </button>
          <button
            onClick={() => setActiveTab('pasos')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'pasos'
                ? 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/40 font-semibold shadow-sm'
                : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
            }`}
          >
            Método en 5 Pasos
          </button>
          <button
            onClick={() => setActiveTab('riemann')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'riemann'
                ? 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/40 font-semibold shadow-sm'
                : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
            }`}
          >
            Simulador de Rectángulos
          </button>
          <button
            onClick={() => setActiveTab('casos')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'casos'
                ? 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/40 font-semibold shadow-sm'
                : 'text-[#B8BEC9] hover:text-[#F5F5F5]'
            }`}
          >
            Curvas que se Cruzan
          </button>
        </div>

        {/* TAB 1: FORMULA GENERAL */}
        {activeTab === 'fundamento' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#151922] border border-[#343946]">
                <div className="flex items-center gap-1.5 text-[#FF9F43] text-xs font-mono uppercase mb-2">
                  <Sigma className="w-4 h-4" />
                  <span>Fórmula Principal</span>
                </div>
                <div className="py-3 px-4 bg-[#0B0D12] rounded-xl border border-[#343946] text-center my-2">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#FF9F43]">
                    A = ∫ₐᵇ [ f(x) − g(x) ] dx
                  </div>
                  <div className="text-[11px] text-[#B8BEC9] mt-1 font-mono">
                    donde f(x) ≥ g(x) en todo el intervalo [a, b]
                  </div>
                </div>

                <p className="text-xs text-[#B8BEC9] leading-relaxed mt-3">
                  Para calcular el área, restamos la función superior menos la función inferior e integramos
                  entre los límites a y b.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#151922] border border-[#343946] space-y-2">
                <h3 className="text-xs font-bold text-[#F5F5F5] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF9F43]"></span>
                  ¿Qué pasa si una curva es negativa?
                </h3>
                <p className="text-xs text-[#B8BEC9] leading-relaxed">
                  La resta <span className="font-mono text-[#FF9F43]">f(x) - g(x)</span> funciona siempre,
                  incluso si g(x) está debajo del eje X. Por ejemplo: 3 - (-2) = 5 unidades de altura.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#151922] border border-[#343946] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#F5F5F5]">
                <span>Franjas verticales: dA = [f(x) - g(x)] dx</span>
              </div>
              <CartesianCanvas
                fExpr="4 - x^2"
                gExpr="x + 2"
                interval={[-2, 1]}
                fLabel="Superior f(x)"
                gLabel="Inferior g(x)"
                height={260}
                showRiemannBars={true}
                riemannBarsCount={10}
                highlightIntersections={true}
              />
            </div>
          </div>
        )}

        {/* TAB 2: METODO EN 5 PASOS */}
        {activeTab === 'pasos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              {stepsList.map((step) => {
                const isSelected = selectedStep === step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => setSelectedStep(step.num)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#151922] border-[#FF9F43]/50 text-[#F5F5F5] shadow-sm'
                        : 'bg-[#151922]/50 border-[#343946] text-[#B8BEC9] hover:bg-[#151922]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected ? 'bg-[#FF9F43] text-[#0B0D12]' : 'bg-[#0B0D12] text-[#B8BEC9]'
                        }`}
                      >
                        {step.num}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{step.title}</div>
                        <div className="text-[10px] text-[#B8BEC9]">{step.subtitle}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF9F43]' : 'text-[#343946]'}`} />
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-[#151922] border border-[#343946] rounded-2xl p-5 space-y-4">
              {(() => {
                const current = stepsList.find((s) => s.num === selectedStep) || stepsList[0];
                return (
                  <>
                    <div className="flex items-center gap-2.5 pb-2 border-b border-[#343946]">
                      <span className="px-2 py-0.5 rounded bg-[#0B0D12] border border-[#343946] text-[#FF9F43] font-mono text-xs font-bold">
                        Paso {current.num}
                      </span>
                      <h3 className="text-base font-bold text-[#F5F5F5]">{current.title}</h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#B8BEC9] leading-relaxed">{current.desc}</p>

                    <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#343946] text-center font-mono text-sm font-bold text-[#FF9F43]">
                      {current.formula}
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#343946] flex items-start gap-2.5 text-xs text-[#B8BEC9]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF9F43] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#FFC078] block">Consejo práctico:</strong>
                        <span>{current.tip}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-[#343946] text-xs">
                      <button
                        onClick={() => setSelectedStep((prev) => Math.max(1, prev - 1))}
                        disabled={selectedStep === 1}
                        className="text-[#B8BEC9] hover:text-[#F5F5F5] disabled:opacity-30 cursor-pointer"
                      >
                        ← Anterior
                      </button>
                      <button
                        onClick={() => setSelectedStep((prev) => Math.min(5, prev + 1))}
                        disabled={selectedStep === 5}
                        className="text-[#FF9F43] hover:text-[#FFC078] disabled:opacity-30 font-semibold cursor-pointer"
                      >
                        Siguiente →
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: SIMULADOR DE RIEMANN */}
        {activeTab === 'riemann' && (
          <div className="p-5 rounded-2xl bg-[#151922] border border-[#343946]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF9F43]">
                  <Sliders className="w-4 h-4" />
                  <span>SIMULADOR DE PARTICIÓN</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">
                  De Rectángulos a la Integral Continua
                </h3>
                <p className="text-xs text-[#B8BEC9] leading-relaxed">
                  Aumenta el número de rectángulos (n) para observar cómo la suma discreta se aproxima
                  al valor exacto del área (4.50 u²).
                </p>

                <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#343946] space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#B8BEC9]">Franjas (n):</span>
                    <span className="text-[#FF9F43] font-bold">{riemannBars} barras</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    step={2}
                    value={riemannBars}
                    onChange={(e) => setRiemannBars(parseInt(e.target.value))}
                    className="w-full accent-[#FF9F43] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#B8BEC9] font-mono">
                    <span>n = 4</span>
                    <span>n = 20</span>
                    <span>n = 40</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <CartesianCanvas
                  fExpr="4 - x^2"
                  gExpr="x + 2"
                  interval={[-2, 1]}
                  fLabel="f(x) = 4 - x²"
                  gLabel="g(x) = x + 2"
                  height={280}
                  showRiemannBars={true}
                  riemannBarsCount={riemannBars}
                  highlightIntersections={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CASOS ESPECIALES */}
        {activeTab === 'casos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#151922] border border-[#343946] space-y-3">
              <div className="flex items-center gap-1.5 text-[#FF9F43] text-xs font-mono uppercase">
                <Split className="w-4 h-4" />
                <span>1. Curvas que se Cruzan</span>
              </div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">
                Dividir en Subintervalos
              </h3>
              <p className="text-xs text-[#B8BEC9] leading-relaxed">
                Si las curvas se cruzan en un punto interior c, se divide la integral para no anular áreas de signos opuestos.
              </p>
              <div className="p-2.5 bg-[#0B0D12] rounded-xl border border-[#343946] text-center font-mono text-xs text-[#FF9F43]">
                A = ∫ₐᶜ (f − g) dx + ∫_cᵇ (g − f) dx
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#151922] border border-[#343946] space-y-3">
              <div className="flex items-center gap-1.5 text-[#FFC078] text-xs font-mono uppercase">
                <Layers className="w-4 h-4" />
                <span>2. Integrar respecto a Y</span>
              </div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">
                Franjas Horizontales
              </h3>
              <p className="text-xs text-[#B8BEC9] leading-relaxed">
                Cuando las funciones se definen más fácil como x = f(y), integramos curva derecha menos curva izquierda.
              </p>
              <div className="p-2.5 bg-[#0B0D12] rounded-xl border border-[#343946] text-center font-mono text-xs text-[#FFC078]">
                A = ∫_cᵈ [ x_derecha(y) − x_izquierda(y) ] dy
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
