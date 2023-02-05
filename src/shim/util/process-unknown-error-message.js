import { BuildError } from './build-error.js';
import {LogInterface} from '#log';


/** @param {unknown | Error | BuildError | {status: string, value: any | undefined, reason: any | undefined}[]} err
 * @param {LogInterface} log
 * @param {string} [message]
 * @returns {Error}
 */
export function processUnknownError(err, log, message) {
    if (err instanceof BuildError) {
        // Already processed
        return err;
    }
    else if (Array.isArray(err)) {
        // Represents a promise.allSettled error
        const errors = [];
        err.forEach(result => {
            if (result.status === 'rejected') {
                errors.push(processUnknownError(result.reason, log));
            }
        });
        return new BuildError('Promise.allSettled Error, logs posted', { cause: errors });
    }
    else {
        message = processUnknownErrorMessage(err);
        const error = new BuildError(message, { cause: err });
        if (log) {
            log.error(error);
        }
        return error;
    }
}
/** @param {unknown} err
 * @returns {string}
 */
export function processUnknownErrorMessage(err) {
    if (err instanceof Error) {
        return err.message;
    }
    else if (typeof err === 'string') {
        return err;
    }
    else if (typeof err === 'function') {
        return 'function';
    }
    else if (typeof err === 'bigint' || typeof err === 'number') {
        return err.toString(10);
    }
    else if (typeof err === 'boolean') {
        return '' + err;
    }
    else if (typeof err === 'symbol') {
        return err.toString();
    }
    else {
        return 'unknown error';
    }
}




