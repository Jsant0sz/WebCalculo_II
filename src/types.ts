export interface AcademicData {
  studentName: string;
  studentId: string;
  university: string;
  faculty: string;
  course: string;
  professor: string;
  academicTerm: string;
}

export interface SolvedProblem {
  id: string;
  title: string;
  category: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  statement: string;
  fExpr: string;
  gExpr: string;
  fLabel: string;
  gLabel: string;
  interval: [number, number];
  areaExact: string;
  areaDecimal: number;
  intersectionPoints: { x: number; y: number }[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    formula?: string;
    detail?: string;
  }[];
}

export interface PracticeExercise {
  id: string;
  number: number;
  title: string;
  difficulty: 'Nivel 1 - Básico' | 'Nivel 2 - Intermedio' | 'Nivel 3 - Raíces y Curvas' | 'Nivel 4 - Cruce y Simetría' | 'Nivel 5 - Desafío Avanzado';
  statement: string;
  fExpr: string;
  gExpr: string;
  fLabel: string;
  gLabel: string;
  interval: [number, number];
  acceptedAnswers: string[]; // e.g. ["32/3", "10.67", "10.66", "10.666", "10.667"]
  exactFraction: string;
  decimalValue: number;
  hint: string;
  solutionSteps: {
    stepNumber: number;
    title: string;
    math: string;
    explanation: string;
  }[];
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string; // e.g. "0:58"
  description: string;
  keyTakeaway: string;
  topic: string;
  thumbnailBadge: string;
  customVideoUrl?: string;
  slides: {
    time: number; // in seconds
    title: string;
    text: string;
    visualCode: 'riemann' | 'limits' | 'crossing';
    formula?: string;
  }[];
}

export interface GraphFunctionPreset {
  id: string;
  name: string;
  fExpr: string;
  gExpr: string;
  fLabel: string;
  gLabel: string;
  suggestedInterval: [number, number];
  description: string;
}
