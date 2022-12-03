import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const file = data.get('file') as File;
	if (file) {
		const buffer = Buffer.from(await file.arrayBuffer());
		fs.writeFileSync(`./src/files/${file.name}`, buffer);
	}

	return json({ uploaded: true });
};
