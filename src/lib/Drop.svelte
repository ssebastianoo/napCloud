<script lang="ts">
	import { filesStore } from './store';

	let hovering = false;

	async function upload(files: FileList) {
		const filePath = window.location.pathname.replace('/drive', '').replace('~', '');
		const formData = new FormData();
		for (const file of files) {
			formData.append('file', file);
		}
		formData.append('path', filePath);

		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});
		const json = await res.json();
		if (json.uploaded) {
			for (const file of files) {
				const newFile = {
					name: file.name,
					folder: false,
					path: (filePath + '/' + file.name).replaceAll('//', '/')
				};
				alert('File uploaded!');
				$filesStore = [...$filesStore, newFile];
			}
		}
	}

	async function handleFilesAdd(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) await upload(target.files);
	}

	async function handleDrop(e: DragEvent) {
		hovering = false;
		if (e.dataTransfer && e.dataTransfer.files.length > 0) {
			const files = e.dataTransfer.files;
			await upload(files);
		}
	}
</script>

<div
	class={hovering ? 'drop hover' : 'drop'}
	on:drop|preventDefault|stopPropagation={handleDrop}
	on:dragover|preventDefault|stopPropagation={() => (hovering = true)}
	on:dragexit|preventDefault|stopPropagation={() => (hovering = false)}
>
	<p>Drop files here</p>
</div>

<div class="drop">
	<label for="upload">Or click here</label>
	<input id="upload" type="file" multiple on:change={handleFilesAdd} />
</div>

<style lang="scss">
	.drop {
		width: 100%;
		height: 100px;
		border: 1px solid wheat;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-bottom: 20px;

		p {
			margin: 0;
		}
	}

	.hover {
		background-color: rgba($color: #ffffff, $alpha: 0.2);
	}
</style>
