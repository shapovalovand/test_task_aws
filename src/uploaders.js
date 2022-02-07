import s3 from './s3.js';
import config from './config.js';
import {
  S3Uploader,
  FilesystemUploader,
} from './lib/gql-uploaders.js';

const s3AvatarUploader = new S3Uploader(s3, { 
  baseKey: 'users/avatars',
  uploadParams: {
    CacheControl: 'max-age:31536000',
    ContentDisposition: 'inline',
  },
});

const fsAvatarUploader = new FilesystemUploader({
  dir: config.app.storageDir, 
  filenameTransform: filename => `${Date.now()}_${filename}`, 
});

export default fsAvatarUploader;