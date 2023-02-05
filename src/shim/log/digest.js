/** */
export class Digest {
    filename;
    constructor(filename) {
        this.filename = filename;
    }
    /** @param {Date} timestamp
       * @param {string} entry
       * @param {object} data
       * @returns {void}
       */
    digest(timestamp, entry, data) {
    }
}


/**
 * @typedef {{
 *   uuid: string,
 *   timestamp: string,
 *   entry: string,
 *   data?: object
 * }} DigestEntry
 */

