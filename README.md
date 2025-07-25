# Sleep Duration Calculator (TypeScript with Timezone Support)

A TypeScript/Node.js function that calculates how long a user slept based on their bedtime and wake-up time, with comprehensive timezone support including DST handling. This project provides a robust, type-safe solution for sleep duration calculations across different time zones.

## Features

- ✅ **TypeScript Support**: Full type safety with comprehensive interfaces and enums
- ✅ **Timezone Support**: Handle sleep calculations across different time zones
- ✅ **DST Handling**: Automatic Daylight Saving Time adjustments
- ✅ **Flexible Time Input**: Supports both 24-hour and 12-hour time formats
- ✅ **Multiple Input Types**: Accepts string times or Date objects
- ✅ **Automatic Day Handling**: Correctly handles sleep periods that span midnight
- ✅ **Sleep Validation**: Provides health recommendations based on sleep duration
- ✅ **Comprehensive Error Handling**: Validates input and provides clear error messages
- ✅ **Extensive Testing**: Includes 25+ test cases covering edge cases and timezone scenarios
- ✅ **Customizable Guidelines**: Configurable sleep health guidelines
- ✅ **Class-based Architecture**: Object-oriented design with configurable instances

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage

```typescript
import { calculateSleepDuration, formatSleepDuration, validateSleepDuration } from './dist/sleepCalculator';

// Calculate sleep duration
const sleepData = calculateSleepDuration('22:30', '07:15');

// Format the result
console.log(formatSleepDuration(sleepData));
// Output: "8 hours and 45 minutes"

// Validate sleep health
const validation = validateSleepDuration(sleepData);
console.log(validation.status); // "optimal"
console.log(validation.recommendation); // "Great! You're getting the recommended amount of sleep."
```

### Timezone Support

```typescript
import { calculateSleepDuration, getTimezoneInfo, formatTimeInTimezone } from './dist/sleepCalculator';

// Calculate sleep in specific timezone
const sleepData = calculateSleepDuration('22:30', '07:15', { 
  timezone: 'America/New_York' 
});

// Get timezone information
const tzInfo = getTimezoneInfo('America/New_York');
console.log(`${tzInfo.name} (${tzInfo.abbreviation}, UTC${tzInfo.offset >= 0 ? '+' : ''}${tzInfo.offset / 60})`);

// Format time in specific timezone
const localTime = formatTimeInTimezone(sleepData.bedtime, 'America/New_York');
```

### Using the SleepCalculator Class

```typescript
import { SleepCalculator, SleepStatus } from './dist/sleepCalculator';

// Create a custom calculator with timezone support
const calculator = new SleepCalculator({
  defaultTimezone: 'Europe/Paris',
  guidelines: {
    insufficient: 5,
    adequate: 6,
    optimal: 8,
    excessive: 12
  }
});

const sleepData = calculator.calculateSleepDuration('23:00', '06:00');
const validation = calculator.validateSleepDuration(sleepData);

// Type-safe status checking
if (validation.status === SleepStatus.OPTIMAL) {
  console.log('🎉 Optimal sleep achieved!');
}
```

### Supported Time Formats

```typescript
// 24-hour format
calculateSleepDuration('22:30', '07:15');

// 12-hour format
calculateSleepDuration('10:30 PM', '6:45 AM');
calculateSleepDuration('10:30pm', '6:45am');

// Date objects
const bedtime = new Date('2024-01-15T23:00:00');
const wakeUp = new Date('2024-01-16T08:30:00');
calculateSleepDuration(bedtime, wakeUp);

// With timezone options
calculateSleepDuration('22:30', '07:15', { 
  timezone: 'Asia/Tokyo',
  date: new Date('2024-01-15'),
  handleDST: true
});
```

## TypeScript Types

### Core Interfaces

```typescript
interface SleepData {
  hours: number;
  minutes: number;
  totalMinutes: number;
  bedtime: Date;
  wakeUpTime: Date;
  durationMs: number;
  timezone?: string;
}

interface SleepValidation {
  status: 'optimal' | 'adequate' | 'insufficient' | 'excessive';
  recommendation: string;
  totalHours: number;
}

interface TimezoneInfo {
  name: string;
  offset: number; // in minutes
  abbreviation: string;
}

interface SleepCalculationOptions {
  timezone?: string;
  date?: Date;
  handleDST?: boolean;
}

type TimeInput = string | Date;
```

### Sleep Status Enum

```typescript
enum SleepStatus {
  INSUFFICIENT = 'insufficient',
  ADEQUATE = 'adequate',
  OPTIMAL = 'optimal',
  EXCESSIVE = 'excessive'
}
```

## API Reference

### Functions

#### `calculateSleepDuration(bedtime: TimeInput, wakeUpTime: TimeInput, options?: SleepCalculationOptions): SleepData`

Calculates the duration between bedtime and wake-up time with timezone support.

**Parameters:**
- `bedtime` (TimeInput): Bedtime in HH:MM format or Date object
- `wakeUpTime` (TimeInput): Wake-up time in HH:MM format or Date object
- `options` (SleepCalculationOptions, optional): Timezone and calculation options

**Returns:** SleepData object with duration information and timezone

#### `formatSleepDuration(sleepData: SleepData): string`

Formats sleep duration for human-readable display.

**Parameters:**
- `sleepData` (SleepData): Result from `calculateSleepDuration`

**Returns:** Formatted string (e.g., "8 hours and 30 minutes")

#### `validateSleepDuration(sleepData: SleepData): SleepValidation`

Validates sleep duration against health recommendations.

**Parameters:**
- `sleepData` (SleepData): Result from `calculateSleepDuration`

**Returns:** SleepValidation object with status and recommendations

#### `getTimezoneInfo(timezone: string): TimezoneInfo`

Gets information about a specific timezone.

**Parameters:**
- `timezone` (string): IANA timezone identifier

**Returns:** TimezoneInfo object with name, offset, and abbreviation

#### `formatTimeInTimezone(date: Date, timezone: string): string`

Formats a date in a specific timezone.

**Parameters:**
- `date` (Date): Date to format
- `timezone` (string): Target timezone

**Returns:** Formatted time string in the specified timezone

### SleepCalculator Class

#### Constructor

```typescript
new SleepCalculator(config?: SleepCalculatorConfig)
```

**Config Options:**
- `guidelines?: Partial<SleepGuidelines>`: Custom sleep health guidelines
- `defaultDate?: Date`: Default date for calculations
- `defaultTimezone?: string`: Default timezone for calculations

#### Methods

- `calculateSleepDuration(bedtime: TimeInput, wakeUpTime: TimeInput, options?: SleepCalculationOptions): SleepData`
- `formatSleepDuration(sleepData: SleepData): string`
- `validateSleepDuration(sleepData: SleepData): SleepValidation`
- `getTimezoneInfo(timezone: string): TimezoneInfo`
- `formatTimeInTimezone(date: Date, timezone: string): string`
- `updateGuidelines(newGuidelines: Partial<SleepGuidelines>): void`
- `getGuidelines(): SleepGuidelines`
- `setDefaultTimezone(timezone: string): void`
- `getDefaultTimezone(): string`

## Running the Examples

```bash
# Build the TypeScript code
npm run build

# Run the main example
npm start

# Run in development mode (with ts-node)
npm run dev

# Run the test suite
npm test

# Run tests on built code
npm run test:build
```

## Timezone Examples

### Example 1: Basic Timezone Calculation

```typescript
// Calculate sleep in New York timezone
const sleepData = calculateSleepDuration('22:30', '07:15', { 
  timezone: 'America/New_York' 
});

console.log(`Sleep duration: ${formatSleepDuration(sleepData)}`);
console.log(`Timezone: ${sleepData.timezone}`);
```

### Example 2: DST Handling

```typescript
const calculator = new SleepCalculator({ defaultTimezone: 'America/New_York' });

// Summer time (DST)
const summerSleep = calculator.calculateSleepDuration('22:30', '07:15', {
  date: new Date('2024-07-15'),
  timezone: 'America/New_York'
});

// Winter time (Standard Time)
const winterSleep = calculator.calculateSleepDuration('22:30', '07:15', {
  date: new Date('2024-01-15'),
  timezone: 'America/New_York'
});

console.log(`Summer: ${formatSleepDuration(summerSleep)}`);
console.log(`Winter: ${formatSleepDuration(winterSleep)}`);
```

### Example 3: International Travel

```typescript
// Person sleeping in different timezones
const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

timezones.forEach(tz => {
  const sleepData = calculateSleepDuration('22:00', '06:00', { timezone: tz });
  const tzInfo = getTimezoneInfo(tz);
  
  console.log(`${tzInfo.abbreviation}: ${formatSleepDuration(sleepData)}`);
  console.log(`Local bedtime: ${formatTimeInTimezone(sleepData.bedtime, tz)}`);
});
```

### Example 4: Custom Timezone Calculator

```typescript
const calculator = new SleepCalculator({
  defaultTimezone: 'Europe/Paris',
  guidelines: {
    insufficient: 6,
    adequate: 7,
    optimal: 8,
    excessive: 10
  }
});

// Change timezone dynamically
calculator.setDefaultTimezone('Asia/Shanghai');

const sleepData = calculator.calculateSleepDuration('23:00', '08:00');
console.log(`Sleep in ${calculator.getDefaultTimezone()}: ${formatSleepDuration(sleepData)}`);
```

## Test Cases

The project includes comprehensive tests covering:

- ✅ Basic sleep duration calculations
- ✅ 12-hour and 24-hour time formats
- ✅ Same-day and overnight sleep periods
- ✅ Date object inputs
- ✅ Formatting functions
- ✅ Sleep validation logic
- ✅ Error handling for invalid inputs
- ✅ Edge cases (midnight transitions, short durations)
- ✅ Type safety and enum usage
- ✅ Custom calculator instances
- ✅ Guidelines configuration
- ✅ Timezone information retrieval
- ✅ Multi-timezone calculations
- ✅ DST handling
- ✅ Timezone formatting
- ✅ Invalid timezone handling

## Sleep Health Guidelines

The validation function uses these default guidelines:

- **Insufficient**: < 6 hours
- **Adequate**: 6-7 hours
- **Optimal**: 7-9 hours
- **Excessive**: > 10 hours

These can be customized when creating a `SleepCalculator` instance.

## Error Handling

The function handles various error scenarios with TypeScript type safety:

- Invalid time formats
- Out-of-range time values
- Unsupported input types
- Malformed time strings
- Invalid timezone identifiers
- Timezone conversion failures

All errors include descriptive messages and proper TypeScript error types.

## Supported Timezones

The calculator supports all IANA timezone identifiers, including:

- **Americas**: `America/New_York`, `America/Los_Angeles`, `America/Chicago`
- **Europe**: `Europe/London`, `Europe/Paris`, `Europe/Berlin`
- **Asia**: `Asia/Tokyo`, `Asia/Shanghai`, `Asia/Dubai`
- **Australia**: `Australia/Sydney`, `Australia/Melbourne`
- **UTC**: `UTC`

## Examples

### Example 1: Normal Sleep Schedule
```typescript
const result = calculateSleepDuration('22:30', '07:15');
console.log(formatSleepDuration(result));
// Output: "8 hours and 45 minutes"
```

### Example 2: Type-Safe Status Checking
```typescript
const result = calculateSleepDuration('01:00', '06:00');
const validation = validateSleepDuration(result);

if (validation.status === SleepStatus.INSUFFICIENT) {
  console.log('⚠️  Sleep duration is insufficient');
}
```

### Example 3: Timezone-Aware Sleep Tracking
```typescript
const sleepSessions = [
  { timezone: 'America/Los_Angeles', bedtime: '22:30', wakeUp: '06:30' },
  { timezone: 'Europe/London', bedtime: '23:00', wakeUp: '07:00' },
  { timezone: 'Asia/Dubai', bedtime: '22:00', wakeUp: '06:00' }
];

sleepSessions.forEach(session => {
  const sleepData = calculateSleepDuration(session.bedtime, session.wakeUp, {
    timezone: session.timezone
  });
  
  const tzInfo = getTimezoneInfo(session.timezone);
  console.log(`${tzInfo.abbreviation}: ${formatSleepDuration(sleepData)}`);
});
```

## Project Structure

```
Sleep-Duration-Calculator/
├── src/
│   ├── types.ts              # TypeScript type definitions
│   ├── sleepCalculator.ts    # Main calculator class and functions
│   ├── index.ts              # Example usage and demonstrations
│   └── test.ts               # Comprehensive test suite
├── dist/                     # Compiled JavaScript output
├── package.json              # Project configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Development

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Development Mode

```bash
npm run dev
```

Runs the example directly with ts-node (no build required).

### Testing

```bash
npm test
```

Runs the test suite with ts-node.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this calculator.

## License

MIT License - feel free to use this code in your own projects. 