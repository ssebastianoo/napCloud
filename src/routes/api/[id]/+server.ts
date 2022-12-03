import type { RequestHandler } from './$types';
import fs from 'fs';

export const GET: RequestHandler = ({ params }) => {
	const file = fs.readFileSync(`./src/files/${params.id}`);
	return new Response(file);
};
