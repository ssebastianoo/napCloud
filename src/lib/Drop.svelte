<script lang="ts">
	import { filesStore } from './store';

	let hovering = false;

	async function handleDrop(e: DragEvent) {
		hovering = false;
		console.log(e.dataTransfer?.files);
		if (e.dataTransfer && e.dataTransfer.files.length > 0) {
			const file = e.dataTransfer.files[0];

			const formData = new FormData();
			formData.append('file', e.dataTransfer.files[0]);

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const json = await res.json();
			if (json.uploaded) {
				let cover: string | null;
				if (['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
					cover = URL.createObjectURL(file);
				} else {
					cover = '/default-file.png';
				}

				filesStore.update((files) => {
					const newFile = {
						name: file.name,
						cover: cover,
						folder: false
					};
					return [...files, newFile];
				});
				alert('File uploaded!');
			}
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

<style lang="scss">
	.drop {
		width: 100%;
		height: 100px;
		border: 1px solid wheat;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;

		p {
			margin: 0;
		}
	}

	.hover {
		background-color: rgba($color: #ffffff, $alpha: 0.2);
	}
</style>
