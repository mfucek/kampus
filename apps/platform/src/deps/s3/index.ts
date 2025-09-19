// export const listFiles = async (prefix: string) => {
// 	const command = new ListObjectsCommand({
// 		Bucket: bucket,
// 		Prefix: prefix
// 	});
// 	const response = await r2Client.send(command);
// 	return response.Contents;
// };

// export const uploadFiles = async (files: File[]) => {
// 	const response = files.map(async (file) => {
// 		const body = (await file.arrayBuffer()) as Buffer;
// 		const command = new PutObjectCommand({
// 			Bucket: bucket,
// 			Key: file.name,
// 			Body: body
// 		});
// 		return await r2Client.send(command);
// 	});
// 	return Promise.all(response);
// };
