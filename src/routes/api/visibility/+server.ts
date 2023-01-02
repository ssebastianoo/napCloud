import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { checkToken, setFileVisibility, isFilePublic } from '$lib/server/db';

export const GET: RequestHandler = async ({ request, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });

	const params = new URL(request.url).searchParams;
	const filePath = params.get('path');
	if (!filePath) return new Response('Missing path param', { status: 400 });
	return json({ visible: await isFilePublic(filePath) });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionid = cookies.get('sessionid');
	const { success } = await checkToken(sessionid);
	if (!success) return new Response('Unauthorized', { status: 401 });

	const data = await request.json();
	const filePath: string = data.path;
	const visible: boolean = data.visible;

	if (!filePath || ![true, false].includes(visible)) return json({ success: false });
	await setFileVisibility(filePath, visible);
	return json({ success: true });
};
