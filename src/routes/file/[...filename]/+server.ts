import type { RequestHandler } from './$types';
import path from 'path';
import fs from 'fs';
import { PUBLIC_STORE_PATH } from '$env/static/public';
import { checkToken } from '$lib/server/db';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });
	const file = fs.readFileSync(path.join(PUBLIC_STORE_PATH, params.filename));
	return new Response(file);
};
