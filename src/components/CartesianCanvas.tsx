import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createFunction, computeRiemannBars, findIntersections } from '../utils/mathEngine';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

interface CartesianCanvasProps {
  fExpr: string;
  gExpr: string;
  interval?: [number, number];
  fLabel?: string;
  gLabel?: string;
  showRiemannBars?: boolean;
  riemannBarsCount?: number;
  highlightIntersections?: boolean;
  height?: number;
  showControls?: boolean;
  interactiveHover?: boolean;
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = ({
  fExpr,
  gExpr,
  interval = [-2.5, 2.5],
  fLabel = 'f(x)',
  gLabel = 'g(x)',
  showRiemannBars = false,
  riemannBarsCount = 12,
  highlightIntersections = true,
  height = 360,
  showControls = true,
  interactiveHover = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport boundaries in math units
  const [xMin, setXMin] = useState<number>(-4);
  const [xMax, setXMax] = useState<number>(4);
  const [yMin, setYMin] = useState<number>(-2);
  const [yMax, setYMax] = useState<number>(6);

  // Hover state
  const [mousePos, setMousePos] = useState<{
    pixelX: number;
    pixelY: number;
    mathX: number;
    mathY: number;
    yF: number;
    yG: number;
  } | null>(null);

  // Auto-fit to interval when expressions change
  useEffect(() => {
    const f = createFunction(fExpr);
    const g = createFunction(gExpr);
    const roots = findIntersections(f, g, -6, 6);

    let lowX = interval[0];
    let highX = interval[1];

    if (roots.length >= 2) {
      lowX = Math.min(lowX, roots[0].x);
      highX = Math.max(highX, roots[roots.length - 1].x);
    }

    const spanX = Math.max(2, highX - lowX);
    const paddingX = Math.max(1.2, spanX * 0.45);
    const newXMin = lowX - paddingX;
    const newXMax = highX + paddingX;

    let minY = 0;
    let maxY = 0;
    const sampleSteps = 40;
    for (let i = 0; i <= sampleSteps; i++) {
      const x = lowX + ((highX - lowX) * i) / sampleSteps;
      const y1 = f(x);
      const y2 = g(x);
      minY = Math.min(minY, y1, y2);
      maxY = Math.max(maxY, y1, y2);
    }

    const spanY = Math.max(2, maxY - minY);
    const paddingY = Math.max(1, spanY * 0.4);

    setXMin(Math.floor(newXMin - 0.5));
    setXMax(Math.ceil(newXMax + 0.5));
    setYMin(Math.floor(minY - paddingY));
    setYMax(Math.ceil(maxY + paddingY));
  }, [fExpr, gExpr, interval[0], interval[1]]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;

    // Coordinate conversions
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => canvasHeight - ((y - yMin) / (yMax - yMin)) * canvasHeight;
    const toMathX = (cx: number) => xMin + (cx / width) * (xMax - xMin);

    // Clear background with deep dark night palette (#151922 to #0B0D12)
    ctx.clearRect(0, 0, width, canvasHeight);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGrad.addColorStop(0, '#151922');
    bgGrad.addColorStop(1, '#0B0D12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, canvasHeight);

    // Draw Subtle Coordinate Grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#B8BEC9';

    // Vertical grid lines
    const xStep = Math.max(1, Math.round((xMax - xMin) / 8));
    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, canvasHeight);
      ctx.stroke();

      if (Math.abs(x) > 0.01) {
        ctx.fillText(x.toString(), cx + 4, toCanvasY(0) + 14);
      }
    }

    // Horizontal grid lines
    const yStep = Math.max(1, Math.round((yMax - yMin) / 6));
    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (Math.abs(y) > 0.01) {
        ctx.fillText(y.toString(), toCanvasX(0) + 6, cy - 4);
      }
    }

    // Draw Main Axes
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#343946';

    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvasHeight);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#B8BEC9';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('x', width - 16, originY - 8);
    ctx.fillText('y', originX + 8, 16);

    const f = createFunction(fExpr);
    const g = createFunction(gExpr);

    const intA = Math.min(interval[0], interval[1]);
    const intB = Math.max(interval[0], interval[1]);

    // 1. Draw Shaded Region between f(x) and g(x) on [intA, intB] with warm orange gradient
    if (intB > intA) {
      const steps = 200;
      const dx = (intB - intA) / steps;

      ctx.save();
      ctx.beginPath();
      const startX = toCanvasX(intA);
      ctx.moveTo(startX, toCanvasY(f(intA)));

      for (let i = 1; i <= steps; i++) {
        const x = intA + i * dx;
        ctx.lineTo(toCanvasX(x), toCanvasY(f(x)));
      }

      for (let i = steps; i >= 0; i--) {
        const x = intA + i * dx;
        ctx.lineTo(toCanvasX(x), toCanvasY(g(x)));
      }
      ctx.closePath();

      // Warm orange subtle gradient
      const grad = ctx.createLinearGradient(toCanvasX(intA), 0, toCanvasX(intB), canvasHeight);
      grad.addColorStop(0, 'rgba(255, 159, 67, 0.22)');
      grad.addColorStop(0.5, 'rgba(255, 192, 120, 0.16)');
      grad.addColorStop(1, 'rgba(255, 159, 67, 0.22)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Soft discrete boundary
      ctx.strokeStyle = 'rgba(255, 159, 67, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Riemann Approximation Rectangles (if enabled)
    if (showRiemannBars && riemannBarsCount > 0 && intB > intA) {
      const bars = computeRiemannBars(f, g, intA, intB, riemannBarsCount);
      bars.forEach((bar) => {
        const barLeft = toCanvasX(bar.x);
        const barRight = toCanvasX(bar.x + bar.width);
        const barWidth = Math.max(1, barRight - barLeft);
        const topY = toCanvasY(bar.yTop);
        const bottomY = toCanvasY(bar.yBottom);
        const barH = bottomY - topY;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 159, 67, 0.16)';
        ctx.strokeStyle = 'rgba(255, 159, 67, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.fillRect(barLeft, topY, barWidth, barH);
        ctx.strokeRect(barLeft, topY, barWidth, barH);

        const midCX = toCanvasX(bar.midX);
        const midCY = toCanvasY(bar.yTop);
        ctx.beginPath();
        ctx.arc(midCX, midCY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFC078';
        ctx.fill();
        ctx.restore();
      });
    }

    // 3. Draw Curves with Soft Warm Glow
    const drawCurve = (
      fn: (x: number) => number,
      color: string,
      glowColor: string,
      _label: string
    ) => {
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      const plotSteps = width;
      let started = false;

      for (let px = 0; px <= plotSteps; px += 2) {
        const x = toMathX(px);
        const y = fn(x);
        const cy = toCanvasY(y);

        if (!isNaN(cy) && isFinite(cy) && cy >= -canvasHeight && cy <= canvasHeight * 2) {
          if (!started) {
            ctx.moveTo(px, cy);
            started = true;
          } else {
            ctx.lineTo(px, cy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    // Draw g(x) first in crisp white/light slate
    drawCurve(g, '#CBD5E1', 'rgba(255, 255, 255, 0.25)', gLabel);

    // Draw f(x) second in warm orange
    drawCurve(f, '#FF9F43', 'rgba(255, 192, 120, 0.45)', fLabel);

    // 4. Highlight Boundaries and Intersections
    if (highlightIntersections) {
      const roots = findIntersections(f, g, xMin, xMax);

      roots.forEach((pt) => {
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 159, 67, 0.2)';
        ctx.strokeStyle = '#FF9F43';
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#F5F5F5';
        ctx.shadowColor = '#FFC078';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillStyle = '#F5F5F5';
        ctx.shadowBlur = 0;
        const tag = `(${pt.x}, ${pt.y})`;
        ctx.fillText(tag, cx + 8, cy - 8);
        ctx.restore();
      });
    }

    // 5. Vertical Limit Lines for [a, b]
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#343946';
    ctx.lineWidth = 1.2;

    const ca = toCanvasX(intA);
    const cb = toCanvasX(intB);

    ctx.beginPath();
    ctx.moveTo(ca, 0);
    ctx.lineTo(ca, canvasHeight);
    ctx.moveTo(cb, 0);
    ctx.lineTo(cb, canvasHeight);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#FF9F43';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillText(`a = ${intA}`, ca - 18, canvasHeight - 8);
    ctx.fillText(`b = ${intB}`, cb + 6, canvasHeight - 8);
    ctx.restore();

    // 6. Interactive Cursor Hover Crosshair & Readout
    if (interactiveHover && mousePos) {
      const { pixelX, pixelY, mathX, yF, yG } = mousePos;

      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#343946';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(pixelX, 0);
      ctx.lineTo(pixelX, canvasHeight);
      ctx.stroke();

      const cyF = toCanvasY(yF);
      ctx.beginPath();
      ctx.arc(pixelX, cyF, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF9F43';
      ctx.fill();

      const cyG = toCanvasY(yG);
      ctx.beginPath();
      ctx.arc(pixelX, cyG, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#CBD5E1';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pixelX, cyF);
      ctx.lineTo(pixelX, cyG);
      ctx.stroke();

      ctx.restore();
    }
  }, [
    xMin,
    xMax,
    yMin,
    yMax,
    fExpr,
    gExpr,
    interval,
    fLabel,
    gLabel,
    showRiemannBars,
    riemannBarsCount,
    highlightIntersections,
    interactiveHover,
    mousePos,
  ]);

  // Handle Resize and Canvas HiDPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      draw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactiveHover) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const mathX = xMin + (pixelX / rect.width) * (xMax - xMin);
    const mathY = yMax - (pixelY / rect.height) * (yMax - yMin);

    const f = createFunction(fExpr);
    const g = createFunction(gExpr);

    setMousePos({
      pixelX,
      pixelY,
      mathX: Number(mathX.toFixed(3)),
      mathY: Number(mathY.toFixed(3)),
      yF: Number(f(mathX).toFixed(3)),
      yG: Number(g(mathX).toFixed(3)),
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const handleZoom = (factor: number) => {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const spanX = (xMax - xMin) * factor;
    const spanY = (yMax - yMin) * factor;

    setXMin(Number((centerX - spanX / 2).toFixed(2)));
    setXMax(Number((centerX + spanX / 2).toFixed(2)));
    setYMin(Number((centerY - spanY / 2).toFixed(2)));
    setYMax(Number((centerY + spanY / 2).toFixed(2)));
  };

  const handleReset = () => {
    const intA = interval[0];
    const intB = interval[1];
    setXMin(Math.floor(intA - 2));
    setXMax(Math.ceil(intB + 2));
    setYMin(-2);
    setYMax(6);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#343946] bg-[#151922] shadow-xl" ref={containerRef}>
      {/* Legend & Indicator Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#151922]/90 backdrop-blur-md border-b border-[#343946] text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-3 h-1 bg-[#FF9F43] rounded-sm shadow-[0_0_6px_#FF9F43]"></span>
            <span className="text-[#FF9F43] font-semibold">{fLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-3 h-1 bg-[#CBD5E1] rounded-sm"></span>
            <span className="text-[#F5F5F5] font-semibold">{gLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#B8BEC9]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FF9F43]/20 border border-[#FF9F43]/40"></span>
            <span>Región</span>
          </div>
        </div>

        {/* Viewport Zoom Tools */}
        {showControls && (
          <div className="flex items-center gap-1 bg-[#0B0D12]/80 rounded-lg p-0.5 border border-[#343946]">
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1 hover:text-[#FF9F43] text-[#B8BEC9] transition-colors"
              title="Acercar (Zoom In)"
              aria-label="Acercar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(1.25)}
              className="p-1 hover:text-[#FF9F43] text-[#B8BEC9] transition-colors"
              title="Alejar (Zoom Out)"
              aria-label="Alejar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:text-[#FF9F43] text-[#B8BEC9] transition-colors"
              title="Restablecer plano"
              aria-label="Restablecer plano cartesiano"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full block cursor-crosshair"
      />

      {/* Hover Coordinate Float Badge */}
      {interactiveHover && mousePos && (
        <div className="absolute bottom-3 left-3 bg-[#151922]/95 backdrop-blur-md border border-[#343946] text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#F5F5F5]">
            <Crosshair className="w-3 h-3 text-[#FF9F43]" />
            <span>x = {mousePos.mathX}</span>
          </div>
          <div className="text-[#FF9F43]">f(x) = {mousePos.yF}</div>
          <div className="text-[#F5F5F5]">g(x) = {mousePos.yG}</div>
          <div className="text-[#FFC078] font-semibold border-l border-[#343946] pl-2">
            Δy = {Math.abs(mousePos.yF - mousePos.yG).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};
