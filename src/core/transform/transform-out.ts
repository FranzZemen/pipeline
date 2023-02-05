/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformOutConstructor<CLASS extends TransformOut<PIPE_OUT>, PIPE_OUT> = new (logDepth: number) => CLASS;

/**
 * Abstract class that enforces behavior such that:
 *
 * Derived classes consume pipeline payload (piped in):    false
 * Derived classes consume passed in payload (passed in):  false
 * Derived classes produce pipeline data (piped out):      true
 * Pipeline data is altered:                               true
 * Pipeline out = Derived class out
 */
export abstract class TransformOut<PIPE_OUT> extends Transform<undefined, undefined, PIPE_OUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn = undefined, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(undefined, undefined);
  }

  public executeImpl(pipeIn: undefined, passedIn?: undefined): Promise<PIPE_OUT> {
    return this.executeImplOut();
  }

  public abstract executeImplOut(): Promise<PIPE_OUT>;
}
