import AWS from 'aws-sdk';
import config from './config.js';

const s3 = new AWS.S3(config.s3)

export default s3;