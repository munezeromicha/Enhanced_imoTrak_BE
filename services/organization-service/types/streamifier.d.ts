declare module 'streamifier' {
  import { Readable } from 'stream';

  namespace streamifier {
    function createReadStream(obj: Buffer | string): Readable;
  }

  export = streamifier;
}
