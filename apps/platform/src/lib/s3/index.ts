import { env } from '@/env';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = env.AMPLIFY_BUCKET;
const region = env.AWS_REGION;
const accessKeyId = env.AMPLIFY_ACCESS_KEY_ID;
const secretAccessKey = env.AMPLIFY_SECRET_ACCESS_KEY;

const s3 = new S3Client({
	region,
	credentials: {
		accessKeyId,
		secretAccessKey
	}
});

export const listFiles = async (prefix: string) => {
	const command = new ListObjectsCommand({
		Bucket: bucket,
		Prefix: prefix
	});

	const response = await s3.send(command);

	return response.Contents;
};

export const uploadFiles = async (files: File[]) => {
	const response = files.map(async (file) => {
		const body = (await file.arrayBuffer()) as Buffer;

		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: file.name,
			Body: body
		});

		return await s3.send(command);
	});

	return Promise.all(response);
};

export const getFileUrl = async (key: string) => {
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
};

export const getS3UploadPresignedUrl = async (key: string) => {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
};

export const deleteFile = async (key: string) => {
	const command = new DeleteObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await s3.send(command);
};

export const deleteFiles = async (keys: string[]) => {
	const response = keys.map(async (key) => {
		return await deleteFile(key);
	});

	return Promise.all(response);
};
