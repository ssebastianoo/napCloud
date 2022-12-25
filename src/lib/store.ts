import type { File } from '$lib/utils';
import { writable } from 'svelte/store';

type ContextMenu = {
	show: boolean;
	x: number;
	y: number;
	file: string;
};

export const filesStore = writable<File[]>([]);
export const contextMenu = writable(<ContextMenu>{
	show: false,
	x: 0,
	y: 0,
	file: ''
});
