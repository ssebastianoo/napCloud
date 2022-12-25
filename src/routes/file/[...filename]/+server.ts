import type { RequestHandler } from './$types';
import path from 'path';
import fs from 'fs';
import { PUBLIC_STORE_PATH } from '$env/static/public';

export const GET: RequestHandler = ({ params }) => {
	const file = fs.readFileSync(path.join(PUBLIC_STORE_PATH, params.filename));
	return new Response(file);
};
