import { 
  SleepData, 
  SleepValidation, 
  TimeInput, 
  SleepStatus, 
  SleepGuidelines,
  SleepCalculatorConfig,
  TimezoneInfo,
  SleepCalculationOptions
} from './types';

const DEFAULT_GUIDELINES: SleepGuidelines = {
  insufficient: 6,
  adequate: 7,
  optimal: 9,
  excessive: 10
};

export class SleepCalculator {
  private guidelines: SleepGuidelines;
  private defaultDate: Date;
  private defaultTimezone: string;

  constructor(config: SleepCalculatorConfig = {}) {
    this.guidelines = { ...DEFAULT_GUIDELINES, ...config.guidelines };
    this.defaultDate = config.defaultDate || new Date();
    this.defaultTimezone = config.defaultTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  calculateSleepDuration(
    bedtime: TimeInput, 
    wakeUpTime: TimeInput, 
    options: SleepCalculationOptions = {}
  ): SleepData {
    try {
      const timezone = options.timezone || this.defaultTimezone;
      const baseDate = options.date || this.defaultDate;
      const handleDST = options.handleDST !== false; // Default to true
      
      const bedtimeDate = this.parseTimeToDate(bedtime, baseDate, timezone, handleDST);
      const wakeUpDate = this.parseTimeToDate(wakeUpTime, baseDate, timezone, handleDST);

      // If wake-up time is before bedtime, assume it's the next day
      if (wakeUpDate <= bedtimeDate) {
        wakeUpDate.setDate(wakeUpDate.getDate() + 1);
      }
      
      const durationMs = wakeUpDate.getTime() - bedtimeDate.getTime();
      const totalMinutes = Math.floor(durationMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      return {
        hours,
        minutes,
        totalMinutes,
        bedtime: bedtimeDate,
        wakeUpTime: wakeUpDate,
        durationMs,
        timezone
      };
    } catch (error) {
      throw new Error(`Error calculating sleep duration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private parseTimeToDate(
    time: TimeInput, 
    baseDate: Date, 
    timezone: string, 
    handleDST: boolean
  ): Date {
    if (time instanceof Date) {
      return this.convertToTimezone(time, timezone, handleDST);
    }
    
    if (typeof time === 'string') {
      const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i;
      const match = time.match(timeRegex);
      
      if (!match) {
        throw new Error(`Invalid time format: ${time}. Use HH:MM or HH:MM:SS format`);
      }
      
      let hours = parseInt(match[1]!, 10);
      const minutes = parseInt(match[2]!, 10);
      const seconds = match[3] ? parseInt(match[3], 10) : 0;
      const period = match[4] ? match[4].toLowerCase() : null;
      
      // Handle 12-hour format
      if (period === 'pm' && hours !== 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }
      
      // Validate time values
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        throw new Error(`Invalid time values: ${time}`);
      }
      
      const resultDate = new Date(baseDate);
      resultDate.setHours(hours, minutes, seconds, 0);
      
      return this.convertToTimezone(resultDate, timezone, handleDST);
    }
    
    throw new Error(`Unsupported time format: ${typeof time}`);
  }

  private convertToTimezone(date: Date, timezone: string, handleDST: boolean): Date {
    try {
      // Create a new date in the target timezone
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const targetDate = new Date(utc);
      
      if (handleDST) {
        // Get the timezone offset for the target date
        const targetOffset = this.getTimezoneOffset(targetDate, timezone);
        const currentOffset = this.getTimezoneOffset(new Date(), timezone);
        
        // Adjust for DST if necessary
        if (targetOffset !== currentOffset) {
          const dstAdjustment = targetOffset - currentOffset;
          targetDate.setMinutes(targetDate.getMinutes() + dstAdjustment);
        }
      }
      
      return targetDate;
    } catch (error) {
      // Fallback to local timezone if timezone conversion fails
      console.warn(`Timezone conversion failed for ${timezone}, using local timezone`);
      return date;
    }
  }

  private getTimezoneOffset(date: Date, timezone: string): number {
    try {
      const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
      return (utc.getTime() - target.getTime()) / 60000;
    } catch {
      return date.getTimezoneOffset();
    }
  }

  getTimezoneInfo(timezone: string): TimezoneInfo {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
      const offset = (utc.getTime() - target.getTime()) / 60000;
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      });
      
      const parts = formatter.formatToParts(now);
      const abbreviation = parts.find(part => part.type === 'timeZoneName')?.value || timezone;
      
      return {
        name: timezone,
        offset,
        abbreviation
      };
    } catch (error) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }
  }

  formatTimeInTimezone(date: Date, timezone: string): string {
    try {
      return date.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return date.toLocaleTimeString();
    }
  }

  formatSleepDuration(sleepData: SleepData): string {
    const { hours, minutes } = sleepData;
    
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }

  validateSleepDuration(sleepData: SleepData): SleepValidation {
    const { hours, minutes } = sleepData;
    const totalHours = hours + minutes / 60;
    
    let status: SleepStatus;
    let recommendation: string;
    
    if (totalHours < this.guidelines.insufficient) {
      status = SleepStatus.INSUFFICIENT;
      recommendation = 'You may not be getting enough sleep. Consider going to bed earlier.';
      console.log(`Status: ${status}`)
      console.log(`Recommendation: ${recommendation}`)
      console.log('⚠️  Sleep duration is insufficient \n')
    } else if (totalHours > this.guidelines.excessive) {
      status = SleepStatus.EXCESSIVE;
      recommendation = 'You may be sleeping too much. Consider adjusting your sleep schedule.';
      console.log(`Status: ${status}`)
      console.log(`Recommendation: ${recommendation}`)
      console.log('Sleep duration is excessive \n')
    } else if (totalHours >= this.guidelines.adequate && totalHours <= this.guidelines.optimal) {
      status = SleepStatus.OPTIMAL;
      recommendation = 'Great! You\'re getting the recommended amount of sleep.';
      console.log(`Status: ${status}`)
      console.log(`Recommendation: ${recommendation}`)
      console.log("Sleep duration is optimal \n")
    } else {
      status = SleepStatus.ADEQUATE;
      recommendation = 'Your sleep duration is adequate but could be optimized.';
      console.log(`Status: ${status}`)
      console.log(`Recommendation: ${recommendation}`)
      console.log('Sleep duration is adequate \n')
    }
    
    return {
      status,
      recommendation,
      totalHours: Math.round(totalHours * 100) / 100
    };
  }

  updateGuidelines(newGuidelines: Partial<SleepGuidelines>): void {
    this.guidelines = { ...this.guidelines, ...newGuidelines };
  }

  getGuidelines(): SleepGuidelines {
    return { ...this.guidelines };
  }

  setDefaultTimezone(timezone: string): void {
    this.defaultTimezone = timezone;
  }

  getDefaultTimezone(): string {
    return this.defaultTimezone;
  }
}

// Create default instance
const defaultCalculator = new SleepCalculator();

// Export functions that use the default instance
export const calculateSleepDuration = (
  bedtime: TimeInput, 
  wakeUpTime: TimeInput, 
  options: SleepCalculationOptions = {}
): SleepData => {
  return defaultCalculator.calculateSleepDuration(bedtime, wakeUpTime, options);
};

export const formatSleepDuration = (sleepData: SleepData): string => {
  return defaultCalculator.formatSleepDuration(sleepData);
};

export const validateSleepDuration = (sleepData: SleepData): SleepValidation => {
  return defaultCalculator.validateSleepDuration(sleepData);
};

export const getTimezoneInfo = (timezone: string): TimezoneInfo => {
  return defaultCalculator.getTimezoneInfo(timezone);
};

export const formatTimeInTimezone = (date: Date, timezone: string): string => {
  return defaultCalculator.formatTimeInTimezone(date, timezone);
};

// Export types and classes
export * from './types'; 