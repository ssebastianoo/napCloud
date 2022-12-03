import fs from 'fs';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	const filesList = fs.readdirSync('./src/files');
	const files: {
		name: string;
		cover: string | null;
	}[] = [];

	for (const file of filesList) {
		const fileType = file.split('.').pop()?.toLocaleLowerCase();
		if (fileType) {
			if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
				files.push({
					name: file,
					cover: `data:image/${fileType};base64,${fs.readFileSync(`./src/files/${file}`, 'base64')}`
				});
			} else {
				files.push({
					name: file,
					cover: null
				});
			}
		}
	}

	return {
		files
	};
};
