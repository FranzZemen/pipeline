/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';


export type TransformInOutConstructor<
  CLASS extends TransformInOut<PIPE_IN, PIPE_OUT>, PIPE_IN, PIPE_OUT> = new (logDepth: number) => CLASS;


/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    true
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 *
 */
export abstract class TransformInOut<PIPE_IN, PIPE_OUT> extends Transform<undefined, PIPE_IN, PIPE_OUT> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: PIPE_IN, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(payload, undefined);
  }

  public executeImpl(pipeIn: PIPE_IN, passedIn?: undefined): Promise<PIPE_OUT> {
    return this.executeImplInOut(pipeIn);
  }

  public abstract executeImplInOut(pipedIn: PIPE_IN): Promise<PIPE_OUT>;
}
