<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { filesStore } from './store';

	async function createFolder() {
		const name = prompt('Folder name');
		const filePath = window.location.pathname.replace('/drive', '').replace('~', '');

		if (!name) return;

		const res = await fetch('/api/createFolder', {
			method: 'POST',
			body: JSON.stringify({
				name,
				path: filePath
			})
		});

		const json = await res.json();
		if (json.success) {
			const newFile = {
				name: name,
				folder: true,
				path: (filePath + '/' + name).replaceAll('//', '/')
			};
			alert('Folder Created');
			$filesStore = [...$filesStore, newFile];
		} else {
			alert(json.error);
		}
	}
</script>

<button on:click|preventDefault={createFolder}>Create Folder</button>
