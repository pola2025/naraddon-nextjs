
import { S3Client } from '@aws-sdk/client-s3';

const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const defaultBucket = process.env.CLOUDFLARE_R2_BUCKET;
const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

if (!accessKeyId || !secretAccessKey || !endpoint) {
  throw new Error('Missing Cloudflare R2 configuration.');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const INVALID_FILENAME_CHARS = /[^a-zA-Z0-9._-]/g;

export function sanitizeFileName(filename: string) {
  const trimmed = filename.trim();
  if (!trimmed) {
    return 'file';
  }
  return trimmed.replace(INVALID_FILENAME_CHARS, '-');
}


export function buildR2ObjectUrl(key: string, bucketName: string = defaultBucket || ''): string {
  const normalizedKey = key.startsWith('/') ? key.slice(1) : key;
  if (publicBaseUrl) {
    const trimmedBase = publicBaseUrl.endsWith('/') ? publicBaseUrl.slice(0, -1) : publicBaseUrl;
    return `${trimmedBase}/${normalizedKey}`;
  }

  const baseEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

  if (bucketName) {
    return `${baseEndpoint}/${bucketName}/${normalizedKey}`;
  }

  return `${baseEndpoint}/${normalizedKey}`;
}
