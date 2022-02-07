import { createWriteStream } from 'fs';
import { normalize, resolve as _resolve } from 'path';
import { v4 as uuid } from 'uuid';

export function uuidFilenameTransform(filename = '') { 
    const fileExtension = path.extname(filename);
  
    return `${uuid()}${fileExtension}`;
  }
  
export class S3Uploader {
  constructor(s3, config) {
      const {
      baseKey = '',
      uploadParams = {},                           
      concurrencyOptions = {},
      filenameTransform = uuidFilenameTransform, 
      } = config;

      this._s3 = s3;
      this._baseKey = baseKey.replace('/$', ''); 
      this._filenameTransform = filenameTransform; 
      this._uploadParams = uploadParams;
      this._concurrencyOptions = concurrencyOptions;
  }

  async upload(stream, { filename, mimetype }) {
      const transformedFilename = this._filenameTransform(filename); 

      const { Location } = await this._s3
      .upload(
          {
          ...this._uploadParams, 
          Body: stream,
          Key: `${this._baseKey}/${transformedFilename}`,
          ContentType: mimetype,
          },
          this._concurrencyOptions
      )
      .promise();

      return Location; 
  }
}

export class FilesystemUploader {
  constructor(config = {}) {
    const {
      dir = '',
      filenameTransform = uuidFilenameTransform
    } = config;

    this._dir = normalize(dir);
    this._filenameTransform = filenameTransform;
  }

  async upload(stream, { filename }) {
    const transformedFilename = this._filenameTransform(filename);

    const fileLocation = _resolve(this._dir, transformedFilename);
    const writeStream = stream.pipe(createWriteStream(fileLocation));

    await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
      });
      return `file://${fileLocation}`;
  }
}

export default {
    FilesystemUploader,
    S3Uploader,
    uuidFilenameTransform
};