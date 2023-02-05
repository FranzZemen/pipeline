/*
Created by Franz Zemen 01/05/2023
License Type: MIT
*/
export var BuildErrorNumber;
(function (BuildErrorNumber) {
    BuildErrorNumber["DirectoryAlreadyExists"] = "Error 1: Directory Already Exists";
})(BuildErrorNumber || (BuildErrorNumber = {}));
/** @extends Error */
export class BuildError extends Error {
    errorNumber;
    /** @public */
    constructor(message, options, errorNumber) {
        super(message, options);
        this.errorNumber = errorNumber;
    }
}




