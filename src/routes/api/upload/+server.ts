import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import path from 'path';
import fs from 'fs';
import { PUBLIC_STORE_PATH } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const file = data.get('file') as File;
	const filePath = data.get('path') as string;

	if (file) {
		const buffer = Buffer.from(await file.arrayBuffer());
		fs.writeFileSync(path.join(PUBLIC_STORE_PATH, filePath, file.name), buffer);
	}

	return json({ uploaded: true });
};
