/*
Created by Franz Zemen 12/27/2022
License Type: MIT
*/

import {ParallelPipe} from '../parallel-pipe/index.js';
import {SeriesPipe} from '../series-pipe/index.js';
import {TransformPipe} from '../transform-pipe/index.js';


export type PipelineOptions = {
  name: string;
  logDepth: number;
}

export type Pipe = TransformPipe<any, any, any> | SeriesPipe<any, any> | ParallelPipe<any, any>;
