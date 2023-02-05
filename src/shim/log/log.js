/**
 * A minimal feature console logger
 * @module build-tools/log
 * @author Franz zemen
 * @licence MIT
 */
import EventEmitter from 'events';
import { Console } from 'node:console';
import { Writable } from 'node:stream';
import { inspect } from 'node:util';
import { BackgroundColor, ConsoleCode, ForegroundColor, utf8SpecialCharacters } from './console-types.js';
const logLevelValues = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    trace: 4
};

/**
 * @typedef {import('./log-interface').TreatmentName} TreatmentName
 * @typedef {import('./log-interface').Treatments} Treatments
 * @typedef {import('./log-interface').LogLevel} LogLevel
 */


/**
 * Log configuration object
 * @property {string} level     - The log level
 * @type {{treatments: {warn: {background: string, foreground: string}, finer: {background: string, foreground: string}, debug: {background:
 *   string, foreground: string}, none: {background: string, foreground: string}, error: {background: string, foreground: string}, info: {background:
 *   string, foreground: string}}, level: string}}
 */
export let logConfig = {
    level: 'info',
    treatments: {
        // Default log level schemes
        info: {
            foreground: ForegroundColor._256_ForegroundDullGreen29,
            background: BackgroundColor._8_BackgroundBlack
        },
        warn: {
            foreground: ForegroundColor._8_ForegroundYellow,
            background: BackgroundColor._8_BackgroundBlack,
            prefix: `${BackgroundColor._8_BackgroundBlack}${ForegroundColor._8_ForegroundYellow}${ConsoleCode.Bright}${ConsoleCode.Blink}!${ConsoleCode.Reset} `
        },
        error: {
            foreground: ForegroundColor._8_ForegroundRed,
            background: BackgroundColor._8_BackgroundBlack
        },
        trace: {
            foreground: ForegroundColor._8_ForegroundRed,
            background: BackgroundColor._8_BackgroundBlack
        },
        debug: {
            foreground: ForegroundColor._8_ForegroundBlue,
            background: BackgroundColor._8_BackgroundBlack
        },
        'task-done': {
            foreground: ForegroundColor._256_ForegroundDullGreen29,
            background: BackgroundColor._8_BackgroundBlack
            //suffix:`
            // ${BackgroundColor._8_BackgroundBlack}${ForegroundColor._256_ForegroundDullGreen29}${ConsoleCode.Bright}${utf8SpecialCharacters.WhiteHeavyCheckMark}${ConsoleCode.Reset}`
        },
        'task-internal': {
            foreground: ForegroundColor._256_ForegroundDullGreen29,
            background: BackgroundColor._8_BackgroundBlack,
            prefix: `${utf8SpecialCharacters.RighwardsArrow} `
            // prefix:
            // `${BackgroundColor._8_BackgroundBlack}${ForegroundColor._8_ForegroundWhite}${ConsoleCode.Bright}${utf8SpecialCharacters.RighwardsArrow}${ConsoleCode.Reset}
            // `
        },
        'task-detail': {
            foreground: ForegroundColor._256_ForegroundGrayish101,
            background: BackgroundColor._8_BackgroundBlack
        },
        'pipeline': {
            foreground: ForegroundColor._8_ForegroundWhite,
            background: BackgroundColor._8_BackgroundBlack
        }
    }
};
/** @extends EventEmitter */
export class EmittingConsole extends EventEmitter {
    /** @private
       * @readonly
       */
    _console = undefined;
    constructor() {
        super();
        this._console = new Console({
            stdout: this.initWriteable('stdout'),
            stderr: this.initWriteable('stderr')
        });
    }
    /** @public */
    get console() {
        return this._console;
    }
    /** @private
       * @param {string} event
       * @returns {import("stream").Writable}
       */
    initWriteable(event) {
        let self = this;
        return new Writable({
            write(chunk, encoding, callback) {
                self.emit(event, chunk.toString('utf-8'));
                callback();
            },
            writev(chunks, callback) {
                chunks.forEach(chunk => self.emit(event, chunk.chunk.toString('utf-8')));
                callback();
            }
        });
    }
}
const noOptWriteable = new Writable({
    write(chunk, encoding, callback) {
        callback();
    },
    writev(chunks, callback) {
        callback();
    }
});
export const no_console = new Console({
    stdout: noOptWriteable,
    stderr: noOptWriteable
});
/** */
export class Log {
    depth;
    maxDigestSize;
    /** @static
       * @default 2
       */
    static TabLength = 2;
    /** @static
       * @default ' '.repeat(Log.TabLength)
       */
    static Tab = ' '.repeat(Log.TabLength);
    /** @static */
    static InspectDepth = undefined;
    /** @private
       * @static
       * @default console
       */
    static console = console;
    /** @protected */
    logLevel = undefined;
    /** @protected
       * @default ForegroundColor._8_ForegroundGreen
       */
    foreground = ForegroundColor._8_ForegroundGreen;
    /** @protected
       * @default BackgroundColor._8_BackgroundBlack
       */
    background = BackgroundColor._8_BackgroundBlack;
    constructor(depth = 0, maxDigestSize = 1000) {
        this.depth = depth;
        this.maxDigestSize = maxDigestSize;
        this.logLevel = logConfig.level ?? 'info';
    }
    /** @protected */
    get logLevelValue() {
        return logLevelValues[this.logLevel];
    }
    /** @public
       * @static
       * @param {Console} console
       * @returns {void}
       */
    static setConsole(console) { Log.console = console; }
    ;
    /** @public
       * @static
       * @returns {void}
       */
    static resetConsole() { Log.console = console; }
    ;
    /** @param {Error | string} data
       * @returns {void}
       */
    error(data) {
        if (data && this.logLevelValue <= logLevelValues.error) {
            this.errorImpl(data, 'error');
        }
    }
    /** @param {any} data
       * @returns {void}
       */
    trace(data) {
        if (data && this.logLevelValue <= logLevelValues.trace) {
            this.errorImpl(data, 'trace');
        }
    }
    /** @param {any} data
       * @returns {void}
       */
    warn(data) {
        if (data && this.logLevelValue <= logLevelValues.warn) {
            this.errorImpl(data, 'warn');
        }
    }
    /** @param {any} data
       * @param {TreatmentName} [treatment]
       * @returns {void}
       */
    info(data, treatment) {
        if (data && this.logLevelValue <= logLevelValues.info) {
            this._log(data, 'info', treatment ? treatment : 'info');
        }
    }
    /** @param {any} data
       * @param {TreatmentName} [treatment]
       * @returns {void}
       */
    debug(data, treatment) {
        if (data && this.logLevelValue <= logLevelValues.debug) {
            this._log(data, 'debug', treatment ? treatment : 'debug');
        }
    }
    /**
     * Logs anything at the info or debug level leveraging a custom colorScheme.  Otherwise use the dedicated methods.  This
     * is only enforced at the typescript level, so if you really, really want to you can override with ts-ignore or use javascript.
     * The enforcement is for good design, no side effects on go around
     * @param {any} data  undefined
     * @param {keyof Exclude<LogLevel, 'trace | error | warn'>} logMethod  undefined
     * @param {TreatmentName} treatment  undefined
       * @returns {void}
       */
    log(data, logMethod, [treatment]) {
        this._log(data, logMethod, treatment);
    }
    /**
     * Get the color string
     * @param {TreatmentName} treatment  undefined
       * @protected
       * @returns {string}
       */
    color(treatment) {
        let foreground = this.foreground, background = this.background;
        if (treatment) {
            foreground = logConfig?.treatments[treatment]?.foreground ?? ForegroundColor._8_ForegroundGreen;
            background = logConfig?.treatments[treatment]?.background ?? BackgroundColor._8_BackgroundBlack;
        }
        return foreground + background;
    }
    /** @protected
       * @param {string | any} data
       * @param {keyof LogLevel} logMethodAndScheme
       * @returns {void}
       */
    errorImpl(data, logMethodAndScheme) {
        if (typeof data === 'string') {
            data = this.assembleStringMessage(data, logMethodAndScheme);
            Log.console[logMethodAndScheme](data);
        }
        else if (data && data instanceof Error) {
            if (data.stack) {
                data.stack = data.stack.replaceAll(' at', this.color(logMethodAndScheme) + ' at') + ConsoleCode.Reset;
            }
            Log.console[logMethodAndScheme](this.color(logMethodAndScheme));
            Log.console[logMethodAndScheme](data);
            Log.console[logMethodAndScheme](ConsoleCode.Reset);
        }
        else {
            Log.console[logMethodAndScheme](this.inspect(data));
        }
    }
    /** @protected
       * @param {any} data
       * @param {keyof LogLevel} logMethod
       * @param {TreatmentName} treatment
       * @returns {void}
       */
    _log(data, logMethod, treatment) {
        if (typeof data === 'string') {
            data = this.assembleStringMessage(data, treatment);
            Log.console.log(data);
        }
        else {
            Log.console[logMethod](this.inspect(data));
        }
    }
    /** @private
       * @param {string} message
       * @param {TreatmentName} treatment
       * @returns {string}
       */
    assembleStringMessage(message, treatment) {
        return Log.Tab.repeat(this.depth)
            + (logConfig.treatments[treatment].prefix ? logConfig.treatments[treatment].prefix + ConsoleCode.Reset : '')
            + this.color(treatment) + message
            + ConsoleCode.Reset
            + (logConfig.treatments[treatment].suffix ? logConfig.treatments[treatment].suffix + ConsoleCode.Reset : '');
    }
    /** @private
       * @param {any} data
       * @returns {string}
       */
    inspect(data) {
        return Log.Tab.repeat(this.depth + 1) + inspect(data, false, Log.InspectDepth, true).replaceAll('\n', '\n' + Log.Tab.repeat(this.depth + 1));
    }
}


/** @typedef {keyof LogLevel} LogLevelKey */
/**
 * @typedef {{
 *   level: LogLevelKey,
 *   treatments: Treatments
 * }} LogConfig
 */
/** @typedef {any} T */
/** @typedef {any} Type */
/** @typedef {T extends Type ? never : T} NeverType */
/** @typedef {() => string} ConsoleListener */

