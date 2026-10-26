/**
 * Mathematical Engine for Calculus: Numerical Integration, Safe Evaluator & Intersection Finder
 */

// Safe evaluator for mathematical expressions with single variable x
export function createFunction(expression: string): (x: number) => number {
  const sanitized = expression
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    // Replace implicit multiplication like 2x, 3x^2, 4(x)
    .replace(/(\d)([a-z\(])/g, '$1*$2')
    .replace(/(\))([a-z\d\(])/g, '$1*$2')
    // Support powers: x^2 -> Math.pow(x, 2)
    .replace(/\^/g, '**');

  return (x: number): number => {
    try {
      // Create sandboxed context with standard Math functions
      const fn = new Function(
        'x',
        'sin',
        'cos',
        'tan',
        'sqrt',
        'abs',
        'exp',
        'ln',
        'log',
        'pi',
        'e',
        `
        try {
          const result = ${sanitized};
          return (typeof result === 'number' && !isNaN(result) && isFinite(result)) ? result : 0;
        } catch (e) {
          return 0;
        }
        `
      );

      return fn(
        x,
        Math.sin,
        Math.cos,
        Math.tan,
        Math.sqrt,
        Math.abs,
        Math.exp,
        Math.log,
        Math.log,
        Math.PI,
        Math.E
      );
    } catch {
      return 0;
    }
  };
}

/**
 * Calculates the definite integral of |f(x) - g(x)| on [a, b] using Simpson's Rule
 */
export function integrateAreaBetween(
  f: (x: number) => number,
  g: (x: number) => number,
  a: number,
  b: number,
  n: number = 300
): { area: number; signedArea: number; upperLowerDiff: number } {
  if (a > b) {
    const temp = a;
    a = b;
    b = temp;
  }

  if (Math.abs(b - a) < 1e-9) {
    return { area: 0, signedArea: 0, upperLowerDiff: 0 };
  }

  // Ensure n is even for Simpson's rule
  const intervals = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / intervals;

  const diffAbs = (x: number) => Math.abs(f(x) - g(x));
  const diffSigned = (x: number) => f(x) - g(x);

  let sumAbs = diffAbs(a) + diffAbs(b);
  let sumSigned = diffSigned(a) + diffSigned(b);

  for (let i = 1; i < intervals; i++) {
    const x = a + i * h;
    const factor = i % 2 === 1 ? 4 : 2;
    sumAbs += factor * diffAbs(x);
    sumSigned += factor * diffSigned(x);
  }

  const area = (h / 3) * sumAbs;
  const signedArea = (h / 3) * sumSigned;

  return {
    area: Math.max(0, area),
    signedArea,
    upperLowerDiff: area,
  };
}

/**
 * Generates Riemann rectangular approximations for visualization
 */
export interface RiemannBar {
  x: number;
  width: number;
  yTop: number;
  yBottom: number;
  height: number;
  midX: number;
  isFHigher: boolean;
}

export function computeRiemannBars(
  f: (x: number) => number,
  g: (x: number) => number,
  a: number,
  b: number,
  numBars: number
): RiemannBar[] {
  if (numBars <= 0 || a >= b) return [];
  const dx = (b - a) / numBars;
  const bars: RiemannBar[] = [];

  for (let i = 0; i < numBars; i++) {
    const xLeft = a + i * dx;
    const midX = xLeft + dx / 2;
    const yF = f(midX);
    const yG = g(midX);
    const yTop = Math.max(yF, yG);
    const yBottom = Math.min(yF, yG);
    const height = Math.abs(yF - yG);

    bars.push({
      x: xLeft,
      width: dx,
      yTop,
      yBottom,
      height,
      midX,
      isFHigher: yF >= yG,
    });
  }

  return bars;
}

/**
 * Automatically finds intersection roots of f(x) - g(x) = 0 in [searchA, searchB]
 */
export function findIntersections(
  f: (x: number) => number,
  g: (x: number) => number,
  searchA: number = -6,
  searchB: number = 6,
  steps: number = 400
): { x: number; y: number }[] {
  const h = (searchB - searchA) / steps;
  const diff = (x: number) => f(x) - g(x);
  const roots: number[] = [];

  for (let i = 0; i < steps; i++) {
    const x1 = searchA + i * h;
    const x2 = x1 + h;
    const y1 = diff(x1);
    const y2 = diff(x2);

    if (Math.abs(y1) < 1e-6) {
      if (!roots.some((r) => Math.abs(r - x1) < 0.05)) {
        roots.push(x1);
      }
    } else if (y1 * y2 < 0) {
      // Bisection search
      let low = x1;
      let high = x2;
      for (let iter = 0; iter < 25; iter++) {
        const mid = (low + high) / 2;
        const yMid = diff(mid);
        if (Math.abs(yMid) < 1e-7) {
          low = mid;
          break;
        }
        if (y1 * yMid < 0) {
          high = mid;
        } else {
          low = mid;
        }
      }
      const root = (low + high) / 2;
      if (!roots.some((r) => Math.abs(r - root) < 0.05)) {
        roots.push(root);
      }
    }
  }

  return roots
    .sort((a, b) => a - b)
    .map((x) => ({
      x: Number(x.toFixed(3)),
      y: Number(((f(x) + g(x)) / 2).toFixed(3)),
    }));
}

/**
 * Checks if a user's answer (string like "9/2" or "4.5" or "4.5 u^2") is mathematically correct
 */
export function verifyAnswer(
  userInput: string,
  expectedDecimal: number,
  acceptedList: string[] = []
): { isCorrect: boolean; parsedValue: number | null; feedback: string } {
  if (!userInput || !userInput.trim()) {
    return {
      isCorrect: false,
      parsedValue: null,
      feedback: 'Ingresa un valor numérico o fracción (ej: 9/2 o 4.5).',
    };
  }

  const clean = userInput
    .trim()
    .toLowerCase()
    .replace(/u\^?2/g, '')
    .replace(/unidades\s*cuadradas/g, '')
    .replace(/,/g, '.')
    .trim();

  // Direct match in accepted list
  if (acceptedList.some((ans) => ans.toLowerCase().trim() === clean)) {
    return {
      isCorrect: true,
      parsedValue: expectedDecimal,
      feedback: '¡Exacto! Respuesta matemáticamente correcta.',
    };
  }

  // Parse fraction a/b or decimal
  let val: number | null = null;
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        val = num / den;
      }
    }
  } else {
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      val = num;
    }
  }

  if (val === null) {
    return {
      isCorrect: false,
      parsedValue: null,
      feedback: 'Formato no reconocido. Usa formato decimal (ej: 4.5) o fracción (ej: 9/2).',
    };
  }

  // Check tolerance
  const diff = Math.abs(val - expectedDecimal);
  const relDiff = expectedDecimal === 0 ? diff : diff / Math.abs(expectedDecimal);

  if (diff < 0.05 || relDiff < 0.015) {
    return {
      isCorrect: true,
      parsedValue: val,
      feedback: `¡Excelente! Tu valor ${clean} coincide con el área teórica calculada.`,
    };
  } else {
    return {
      isCorrect: false,
      parsedValue: val,
      feedback: `Tu respuesta (${clean} ≈ ${val.toFixed(2)}) no coincide. Revisa los límites de integración y la resta [f(x) - g(x)].`,
    };
  }
}

/**
 * Returns a readable fraction representation if close to simple fractions
 */
export function toPrettyFraction(val: number): string {
  const commonFractions: { [key: string]: string } = {
    '4.5': '9/2',
    '0.333': '1/3',
    '0.667': '2/3',
    '1.333': '4/3',
    '1.667': '5/3',
    '2.333': '7/3',
    '2.667': '8/3',
    '3.333': '10/3',
    '10.667': '32/3',
    '14.667': '44/3',
    '0.828': '2(√2 - 1)',
    '8': '8',
    '0.5': '1/2',
  };

  const key3 = val.toFixed(3);
  const key1 = val.toFixed(1);
  const key0 = val.toFixed(0);

  if (commonFractions[key3]) return commonFractions[key3];
  if (commonFractions[key1]) return commonFractions[key1];
  if (commonFractions[key0]) return commonFractions[key0];

  return val.toFixed(3);
}
