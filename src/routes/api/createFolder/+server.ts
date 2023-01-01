import { PUBLIC_STORE_PATH } from '$env/static/public';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';
import { checkToken } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });

	const data = await request.json();
	const folderPath = data.path;
	const folderName = data.name;

	if (!folderPath || !folderName) return json({ success: false });

	const fullPath = path.join(PUBLIC_STORE_PATH, folderPath, folderName);
	if (fs.existsSync(fullPath)) return json({ success: false, error: 'Folder already exists' });
	fs.mkdirSync(fullPath, { recursive: true });
	return json({ success: true });
};
