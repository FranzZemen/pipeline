/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {deepCopy} from '#util';
import {Transform} from './transform.js';


export type TransformInConstructor<CLASS extends TransformIn<PIPE_IN>, PIPE_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out is = Pipeline In
 *
 * The pipeline data out (piped out) is simply what was piped in.  Thus pipeline data is not impacted.
 * piped in data.
 *
 * If payload is passed in, it is ignored.
 */
export abstract class TransformIn<PIPED_IN> extends Transform<undefined, PIPED_IN, PIPED_IN> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: PIPED_IN, passedIn = undefined): Promise<PIPED_IN> {
    return super.execute(pipeIn, undefined);
  }

  executeImpl(pipeIn: PIPED_IN, passedIn: undefined): Promise<PIPED_IN> {
    const pipedInCopy = deepCopy(pipeIn)
    return this.executeImplIn(pipedInCopy)
      .then(()=>pipeIn);
  }

  abstract executeImplIn(pipedIn: PIPED_IN): Promise<void>;
}
