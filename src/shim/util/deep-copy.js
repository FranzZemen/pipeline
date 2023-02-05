/*
Created by Franz Zemen 02/03/2023
License Type: MIT
*/
import _ from 'lodash';
export function deepCopy(o) {
    const typeofO = typeof o;
    if (typeofO === 'object') {
        return _.merge({}, o);
    }
    else {
        return o; // Immutable, will copy when used
    }
}
//# sourceMappingURL=deep-copy.js.map