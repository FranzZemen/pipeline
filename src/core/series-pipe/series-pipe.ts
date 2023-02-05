import {Log} from '#log';
import {Transform, TransformConstructor} from '../transform/index.js';
import {processUnknownError} from '#util';
import {Pipeline} from '../pipeline/pipeline.js';

export class SeriesPipe<SERIES_IN, SERIES_OUT = SERIES_IN> {
  log: Log;
  protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any | undefined][] = [];

  private constructor(protected _pipeline: Pipeline<any, any>, depth: number) {
    this.log = new Log(depth);
  }

  /**
   * Start a series, which can start anywhere in the pipeline
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = SERIES_AND_PIPE_IN != PIPELINE_SERIES_AND_PIPE_IN by definition (except if first series, we have to think of general
   * case when pipe creates series in middle of pipeline In general, transform payload out != series out != pipeline payload out
   *
   */
  static start<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    SERIES_IN,
    SERIES_OUT = SERIES_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                pipeline: Pipeline<any, any>,
                payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {

    // ----- Multiline Declaration Separator ----- //

    const pipe = new SeriesPipe<SERIES_IN, SERIES_OUT>(pipeline, pipeline.log.depth + 1);
    return pipe.series<TRANSFORM_CLASS, PASSED_IN>(transformClass, payloadOverride);
  }

  series<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
               payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //

    this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
    return this;
  }

  /**
   * End of the series
   * PIPED_OUT = SERIES PIPED_OUT, which is defined on the class
   *
   */
  endSeries<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                                                                                     payloadOverride?: PASSED_IN): Pipeline<any, any> {
    this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
    return this._pipeline;
  }

  async execute(payload: SERIES_IN): Promise<SERIES_OUT> {
    this.log.info('starting series pipe...', 'pipeline');
    let errorCondition = false;
    try {
      let _payload = payload;
      let output: any;
      for (let i = 0; i < this._pipe.length; i++) {
        try {
          const [transform, payloadOverride] = this._pipe[i];
          output = await transform.execute(_payload, payloadOverride);
          _payload = output;
        } catch (err) {
          errorCondition = true;
          return Promise.reject(processUnknownError(err, this.log));
        }
      }
      return Promise.resolve(output);
    } catch (err) {
      errorCondition = true;
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      if (errorCondition) {
        this.log.info('...series pipe failed', 'error');
      } else {
        this.log.info('...completing series pipe', 'pipeline');
      }
    }
  }
}
