import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2CommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const aws = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function getPresignedPutUrl(
  bucket: string,
  key: string,
  contentType = 'image/jpeg',
  expiresSec = 60 * 60,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(aws, command, { expiresIn: expiresSec })
}

export async function getPresignedGetUrl(bucket: string, key: string, expiresSec = 60 * 60): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })

  return getSignedUrl(aws, command, { expiresIn: expiresSec })
}

export async function deleteObject(bucket: string, key: string): Promise<void> {
  await aws.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
