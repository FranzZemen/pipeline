/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadConstructor<CLASS extends TransformPayload<PASSED_IN>, PASSED_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipeline data (piped out):      false
 * Pipeline data is altered:                               false
 * Pipeline out = Pipeline in
 */
export abstract class TransformPayload<PASSED_IN, PIPED_IN = any> extends Transform<PASSED_IN, PIPED_IN, PIPED_IN> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: PIPED_IN, passedIn: PASSED_IN): Promise<PIPED_IN> {
    return super.execute(pipeIn, passedIn);
  }

  public executeImpl(pipeIn: PIPED_IN, passedIn: PASSED_IN): Promise<PIPED_IN> {
    return this.executeImplPayload(passedIn)
      .then(()=> pipeIn);
  }

  public abstract executeImplPayload(payload: PASSED_IN): Promise<void>;
}
