import fs from 'fs';
import path from 'path';
import type { File } from '$lib/utils';
import { PUBLIC_STORE_PATH } from '$env/static/public';
import { checkToken } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, cookies }) => {
	const sessionid = cookies.get('sessionid');
	if (!sessionid) throw redirect(303, '/login');
	const { success } = await checkToken(sessionid);
	if (!success) throw redirect(303, '/login');

	const filename = params.filename === `~` ? '' : params.filename;
	const pathString = path.join(PUBLIC_STORE_PATH, filename);

	const filesList = fs.readdirSync(pathString);

	const files: File[] = [];

	for (const file of filesList) {
		const stat = fs.lstatSync(path.join(pathString, file));

		files.push({
			name: file,
			folder: stat.isDirectory(),
			path: path.join(filename, file)
		});
	}

	return {
		files
	};
};
