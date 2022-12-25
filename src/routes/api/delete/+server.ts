import { PUBLIC_STORE_PATH } from '$env/static/public';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';

export const DELETE: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const filePath = data.path;

	if (!filePath) return json({ deleted: false });
	fs.unlink(path.join(PUBLIC_STORE_PATH, filePath), (err) => {
		if (err) {
			console.error(err);
			return json({ deleted: false });
		}
	});

	return json({ deleted: true });
};
