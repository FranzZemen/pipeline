/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadOutConstructor<CLASS extends TransformPayloadOut<PASSED_IN, PIPE_OUT>, PASSED_IN, PIPE_OUT> = new (logDepth: number) => CLASS;

/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  true
 * Derived classes produce pipeline data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 */
export abstract class TransformPayloadOut<PASSED_IN, PIPED_OUT, PIPED_IN = any, > extends Transform<PASSED_IN, PIPED_IN, PIPED_OUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: PIPED_IN, passedIn: PASSED_IN): Promise<PIPED_OUT> {
    return super.execute(pipeIn, passedIn);
  }

  public executeImpl(pipeIn: PIPED_IN | undefined, passedIn: PASSED_IN): Promise<PIPED_OUT> {
    return this.executeImplPayloadOut(passedIn);
  }

  public abstract executeImplPayloadOut(passedIn: PASSED_IN): Promise<PIPED_OUT>;

}
