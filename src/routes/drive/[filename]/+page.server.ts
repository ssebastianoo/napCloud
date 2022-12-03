import fs from 'fs';
import path from 'path';
import type { File } from '$lib/utils';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const filename = params.filename === `~` ? '' : params.filename;
	const pathString = path.join('./src/files', filename);

	const filesList = fs.readdirSync(pathString);
	const files: File[] = [];

	for (const file of filesList) {
		let cover: null | string = null;
		let folder = false;

		const stat = fs.lstatSync(path.join(pathString, file));

		if (stat.isDirectory()) {
			folder = true;
		} else {
			const fileType = file.split('.').pop()?.toLocaleLowerCase();
			if (fileType) {
				if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
					cover = `data:image/${fileType};base64,${fs.readFileSync(
						path.join(pathString, file),
						'base64'
					)}`;
				}
			}
		}

		files.push({
			name: file,
			cover: cover,
			folder: folder
		});
	}

	return {
		files
	};
};
