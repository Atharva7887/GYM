export interface PlateSpec {
  weight: number;
  color: string;
  borderColor: string;
  textColor: string;
  heightPx: number; // For visualization
}

export const OLYMPIC_PLATES: PlateSpec[] = [
  { weight: 25, color: '#ef4444', borderColor: '#b91c1c', textColor: '#ffffff', heightPx: 120 }, // Red
  { weight: 20, color: '#3b82f6', borderColor: '#1d4ed8', textColor: '#ffffff', heightPx: 110 }, // Blue
  { weight: 10, color: '#10b981', borderColor: '#047857', textColor: '#ffffff', heightPx: 96 },  // Green
  { weight: 5, color: '#f3f4f6', borderColor: '#9ca3af', textColor: '#111827', heightPx: 80 },  // White
  { weight: 2.5, color: '#1f2937', borderColor: '#4b5563', textColor: '#ffffff', heightPx: 64 }, // Black
  { weight: 1.25, color: '#d1d5db', borderColor: '#6b7280', textColor: '#111827', heightPx: 50 }, // Silver / Chrome
  { weight: 0.5, color: '#9ca3af', borderColor: '#4b5563', textColor: '#111827', heightPx: 40 },
];

export interface PlateResult {
  barWeight: number;
  targetWeight: number;
  weightPerSide: number;
  platesPerSide: { spec: PlateSpec; count: number }[];
  summaryText: string;
  exactMatch: boolean;
  actualWeightOnBar: number;
}

export function calculatePlates(targetWeight: number, barWeight: number = 20): PlateResult {
  if (targetWeight < barWeight) {
    return {
      barWeight,
      targetWeight,
      weightPerSide: 0,
      platesPerSide: [],
      summaryText: 'Bar only',
      exactMatch: targetWeight === barWeight,
      actualWeightOnBar: barWeight,
    };
  }

  const weightNeeded = targetWeight - barWeight;
  let remainingPerSide = weightNeeded / 2;
  const platesPerSide: { spec: PlateSpec; count: number }[] = [];

  for (const plate of OLYMPIC_PLATES) {
    if (remainingPerSide >= plate.weight) {
      const count = Math.floor(remainingPerSide / plate.weight);
      platesPerSide.push({ spec: plate, count });
      remainingPerSide = Math.round((remainingPerSide - count * plate.weight) * 100) / 100;
    }
  }

  const actualWeightPerSide = platesPerSide.reduce(
    (sum, p) => sum + p.spec.weight * p.count,
    0
  );
  const actualWeightOnBar = barWeight + actualWeightPerSide * 2;
  const exactMatch = remainingPerSide === 0;

  const parts = platesPerSide.map((p) => `${p.count} × ${p.spec.weight}`);
  const summaryText = parts.length > 0 ? `Per side: ${parts.join(', ')}` : 'Empty bar';

  return {
    barWeight,
    targetWeight,
    weightPerSide: actualWeightPerSide,
    platesPerSide,
    summaryText,
    exactMatch,
    actualWeightOnBar,
  };
}
