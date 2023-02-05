export {};

/**
 * @typedef {import('./console-types').ForegroundColor} ForegroundColor
 * @typedef {import('./console-types').BackgroundColor} BackgroundColor
 */

/**
 * @typedef {{
 *   debug: 0;
 *   info: 1;
 *   warn: 2,
 *   error: 3;
 *   trace: 4;
 * }} LogLevel
 */
/** @typedef {'task-internal' | 'task-detail' | 'task-done' | 'pipeline'} NamedScheme */
/** @typedef {keyof LogLevel | NamedScheme} TreatmentName */
/**
 * @typedef {{
 *   foreground: ForegroundColor,
 *   background: BackgroundColor,
 *   prefix?: string,
 *   suffix?: string
 * }} Treatment
 */
/**
 * @typedef {{
 *   [key in TreatmentName]: Treatment;
 * }} Treatments
 */

/** @typedef {Object} LogInterface */
