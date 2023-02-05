/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/

import {Log} from '#log'
import {endTiming, processUnknownError, startTiming} from '#util';


export type TransformConstructor<CLASS extends Transform<any, any, any>> = new (logDepth: number) => CLASS;

/**
 * Abstract Transform class.  A Transform is a class that transforms data; data can be intrinsic (obtained by the class through internal means),
 * piped in (provided to the class by the starting Pipeline payload or by the previous Transform, SeriesPipe, or ParallelPipe piped out data, or
 * passed in directly when added to a Pipeline.
 *
 * The transform declares what kind of data it is sending down the Pipeline as output - this does not have to be the transformed data.
 */
export abstract class Transform<PASSED_IN, PIPED_IN, PIPE_OUT> {
  protected log: Log;
  protected errorCondition = false;

  protected constructor(protected depth: number) {
    this.log = new Log(depth);
  }

  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  get logDepth(): number {
    return this.log.depth;
  }

  get name(): string {
    return this.constructor.name;
  }

  async execute(pipe_in: PIPED_IN, passedIn?: PASSED_IN): Promise<PIPE_OUT> {
    const transformContext = this.transformContext(pipe_in, passedIn);
    const maxLineLength = 100;
    if(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`.length  > maxLineLength) {
      this.log.info(`transform ${this.name}`);
      this.log.info(`  on ${transformContext} starting...`);
    } else {
      this.log.info(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`);
    }
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(pipe_in, passedIn);
    } catch (err) {
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      if(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'}`.length  > maxLineLength) {
        this.log.info(`...transform ${this.name}`, this.errorCondition ? 'error' : 'task-done');
        this.log.info(`  on ${transformContext} ${this.errorCondition ? 'failed' : 'completed'}  ${startTimingSuccessful ? endTiming(
          timingMark,
          this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
      } else {
        this.log.info(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(
          timingMark,
          this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
      }
    }
  }

  abstract executeImpl(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): Promise<PIPE_OUT>;

  abstract transformContext(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): string;
}
