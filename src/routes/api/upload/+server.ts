import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import path from 'path';
import fs from 'fs';
import { PUBLIC_STORE_PATH } from '$env/static/public';
import { checkToken } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });

	const data = await request.formData();
	const files = data.getAll('file') as File[];
	const filePath = data.get('path') as string;
	console.log(files);
	if (files) {
		for (const file of files) {
			const buffer = Buffer.from(await file.arrayBuffer());
			fs.writeFileSync(path.join(PUBLIC_STORE_PATH, filePath, file.name), buffer);
		}
	}
	return json({ uploaded: true });
};
