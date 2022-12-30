import { PUBLIC_STORE_PATH } from '$env/static/public';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';
import { checkToken } from '$lib/server/db';

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });

	const data = await request.json();
	const filePath = data.path;

	if (!filePath) return json({ deleted: false });
	const fullPath = path.join(PUBLIC_STORE_PATH, filePath);

	const stat = fs.lstatSync(fullPath);
	if (!stat.isDirectory()) {
		fs.unlink(path.join(PUBLIC_STORE_PATH, filePath), (err) => {
			if (err) {
				console.error(err);
				return json({ deleted: false });
			}
		});
	} else {
		fs.rmdir(path.join(PUBLIC_STORE_PATH, filePath), { recursive: true }, (err) => {
			if (err) {
				console.error(err);
				return json({ deleted: false });
			}
		});
	}

	return json({ deleted: true });
};
