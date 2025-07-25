import { 
  calculateSleepDuration, 
  formatSleepDuration, 
  validateSleepDuration,
  getTimezoneInfo,
  formatTimeInTimezone
} from './sleepCalculator';

function main(): void {
  console.log('🌙 Sleep Duration Calculator (TypeScript) with Timezone Support\n');

  // Example 1: Basic usage
  console.log('Example 1: Basic usage');
  try {
    const sleepData1 = calculateSleepDuration('22:30', '07:15');
    console.log(`Bedtime: 22:30, Wake-up: 07:15`);
    console.log(`Sleep duration: ${formatSleepDuration(sleepData1)}`);
    validateSleepDuration(sleepData1);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Example 2: 12-hour format
  console.log('Example 2: 12-hour format');
  try {
    const sleepData2 = calculateSleepDuration('10:30 PM', '6:45 AM');
    console.log(`Bedtime: 10:30 PM, Wake-up: 6:45 AM`);
    console.log(`Sleep duration: ${formatSleepDuration(sleepData2)}`);
    validateSleepDuration(sleepData2);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Example 3: Timezone support
  console.log('Example 3: Timezone support');
  try {
    const timezone = 'America/New_York';
    const sleepData3 = calculateSleepDuration('22:30', '07:15', { timezone });
    const tzInfo = getTimezoneInfo(timezone);
    console.log(`Bedtime: 22:30, Wake-up: 07:15, Timezone: ${timezone}`);
    console.log(`Bedtime (${tzInfo.abbreviation}): ${formatTimeInTimezone(sleepData3.bedtime, timezone)}`);
    console.log(`Wake-up (${tzInfo.abbreviation}): ${formatTimeInTimezone(sleepData3.wakeUpTime, timezone)}`);
    console.log(`Sleep duration: ${formatSleepDuration(sleepData3)}`);
    validateSleepDuration(sleepData3);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  }
}

if (require.main === module) {
  main();
}

export { main }; 