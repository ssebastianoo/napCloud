import type { File } from '$lib/utils';
import { writable } from 'svelte/store';

export const filesStore = writable<File[]>([]);
