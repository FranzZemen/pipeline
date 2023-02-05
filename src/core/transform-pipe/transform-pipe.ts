import {Transform, TransformConstructor} from '../transform/index.js';
import {Pipeline} from '../pipeline/pipeline.js';

export class TransformPipe<PASSED_IN, PIPE_IN, PIPE_OUT> {
  protected payloadOverride: PASSED_IN | undefined;
  protected constructor(protected _transform: Transform<PASSED_IN, PIPE_IN, PIPE_OUT>, passedIn?: PASSED_IN) {
    this.payloadOverride = passedIn;
  }

  static transform<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    PIPE_IN,
    PIPE_OUT = PIPE_IN>
  (transformClass: TransformConstructor<TRANSFORM_CLASS>, pipeline: Pipeline<any,any>, payloadOverride?: PASSED_IN): TransformPipe<PASSED_IN, PIPE_IN, PIPE_OUT> {
    // ----- Declaration separator ----- //
    return new TransformPipe<PASSED_IN, PIPE_IN, PIPE_OUT>(new transformClass(pipeline.log.depth + 1), payloadOverride);
  }

  get transformName(): string {
    if (this._transform) {
      return this._transform.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(passedIn: PIPE_IN): Promise<PIPE_OUT> {
    const actionName = this.transformName;
    try {
      return await this._transform.execute(passedIn, this.payloadOverride);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
