export interface BodyScansData {
  profile: {
    height: number;
    birthDate: string;
  };
  referenceRanges: {
    totalBodyWater: [number, number];
    protein: [number, number];
    minerals: [number, number];
    bodyFatMass: [number, number];
    weight: [number, number];
  };
  scans: BodyScan[];
}

export interface BodyScan {
  date: string;
  time: string;
  sourceImage?: string;
  inBodyScore: number;
  bodyComposition: {
    totalBodyWater: number;
    protein: number;
    minerals: number;
    bodyFatMass: number;
    skeletalMuscleMass: number;
    weight: number;
  };
  obesityAnalysis: {
    bmi: number;
    percentBodyFat: number;
  };
  weightControl: {
    targetWeight: number;
    weightChange: number;
    fatChange: number;
    muscleChange: number;
  };
  bodyBalance: {
    upper: BalanceStatus;
    lower: BalanceStatus;
    upperLower: BalanceStatus;
  };
  visceralFatLevel: number;
  segmentalLean: SegmentalMeasurement;
  segmentalFat: SegmentalMeasurement;
  impedance: SegmentalImpedance;
}

export type BalanceStatus = "Balanced" | "SlightlyUnbalanced" | "Unbalanced";

export interface SegmentalMeasurement {
  leftArm: SegmentData;
  rightArm: SegmentData;
  trunk: SegmentData;
  leftLeg: SegmentData;
  rightLeg: SegmentData;
}

export interface SegmentData {
  mass: number;
  percent: number;
}

export interface SegmentalImpedance {
  rightArm: ImpedanceData;
  leftArm: ImpedanceData;
  trunk: ImpedanceData;
  rightLeg: ImpedanceData;
  leftLeg: ImpedanceData;
}

export interface ImpedanceData {
  "20kHz": number;
  "100kHz": number;
}
