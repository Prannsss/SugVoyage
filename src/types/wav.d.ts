declare module 'wav' {
  import { Writable } from 'stream';

  interface WriterOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
  }

  class Writer extends Writable {
    constructor(options?: WriterOptions);
  }

  export { Writer };
  export default { Writer };
}
