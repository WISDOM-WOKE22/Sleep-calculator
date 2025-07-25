export interface SleepData {
  hours: number;
  minutes: number;
  totalMinutes: number;
  bedtime: Date;
  wakeUpTime: Date;
  durationMs: number;
  timezone?: string;
}

export interface SleepValidation {
  status: 'optimal' | 'adequate' | 'insufficient' | 'excessive';
  recommendation: string;
  totalHours: number;
}

export type TimeInput = string | Date;

export type TimeFormat = 
  | 'HH:MM'   
  | 'HH:MM:SS'
  | 'HH:MM AM'
  | 'HH:MM PM'
  | 'HH:MM:SS AM'
  | 'HH:MM:SS PM';

export enum SleepStatus {
  INSUFFICIENT = 'insufficient',
  ADEQUATE = 'adequate',
  OPTIMAL = 'optimal',
  EXCESSIVE = 'excessive'
}

export interface SleepGuidelines {
  insufficient: number;
  adequate: number;
  optimal: number;
  excessive: number;
}

export interface SleepCalculatorConfig {
  guidelines?: Partial<SleepGuidelines>;
  defaultDate?: Date;
  defaultTimezone?: string;
}

export interface TimezoneInfo {
  name: string;
  offset: number; // in minutes
  abbreviation: string;
}

export interface SleepCalculationOptions {
  timezone?: string;
  date?: Date;
  handleDST?: boolean;
} 