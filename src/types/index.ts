// BabyAssist AI Type Definitions

export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'asha' | 'supervisor' | 'admin';
  area?: string;
}

export interface Mother {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  lmp?: Date; // Last Menstrual Period
  edd?: Date; // Expected Delivery Date
  riskLevel: RiskLevel;
  pregnancyWeek?: number;
  visitCount: number;
  lastVisit?: Date;
  nextVisit?: Date;
}

export interface Child {
  id: string;
  name: string;
  motherId: string;
  motherName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  ageMonths: number;
  riskLevel: RiskLevel;
  vaccinationStatus: 'up-to-date' | 'due' | 'overdue';
  lastScreening?: Date;
  weight?: number;
  height?: number;
}

export interface HealthExam {
  id: string;
  patientId: string;
  patientType: 'mother' | 'child';
  date: Date;
  vitals: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    height?: number;
    temperature?: number;
    pulseRate?: number;
    spO2?: number;
    hemoglobin?: number;
  };
  bmi?: number;
  notes?: string;
  riskFactors?: string[];
}

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  patientType: 'mother' | 'child';
  riskLevel: RiskLevel;
  scheduledDate: Date;
  address: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  status: 'pending' | 'completed' | 'missed';
  priority: number;
}

export interface AIScreeningResult {
  id: string;
  observations: string[];
  confidenceScore: number;
  riskIndicators: string[];
  suggestedFollowUp?: Date;
  disclaimer: string;
}

export interface Notification {
  id: string;
  type: 'follow-up' | 'vaccination' | 'high-risk' | 'visit-due';
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  dueDate?: Date;
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  todayVisits: number;
  completedVisits: number;
  pendingVisits: number;
  highRiskCases: number;
  totalMothers: number;
  totalChildren: number;
}
