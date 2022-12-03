<script lang="ts">
	import type { File } from '$lib/utils';
	import { filesStore } from './store';
	import { onMount } from 'svelte';

	export let files: File[];

	onMount(() => {
		filesStore.set(files);
		filesStore.subscribe((value) => {
			if (value != files) files = value;
		});
	});

	function getIcon(file: File) {
		if (file.folder) return '/folder.png';
		if (file.cover) return file.cover;
		return '/default-file.png';
	}
</script>

<button
	on:click|preventDefault={() => {
		location.href = '/drive/bruh';
	}}>bruh</button
>
<div class="files">
	{#each files as file}
		{#if file.folder}
			<a href={'/drive/' + file.name}>
				<div class="file type-folder">
					<p>{file.name}</p>
					<img class="cover" src={getIcon(file)} alt={file.name} />
				</div>
			</a>
		{:else}
			<div class="file type-file">
				<p>{file.name}</p>
				<img class="cover" src={getIcon(file)} alt={file.name} />
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.files {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 20px;

		.file {
			height: 100px;
			max-width: 200px;
			min-width: 50px;
			position: relative;
			border-radius: 10px;
			overflow: hidden;
			border: 1px solid wheat;

			.cover {
				height: 100%;
			}
		}

		.type-file {
			p {
				padding: 5px;
				margin: 0;
				position: absolute;
				bottom: 0;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.5);
			}
		}

		.type-folder {
			display: flex;
			align-items: center;
			justify-content: center;

			p {
				position: absolute;
			}
		}
	}
</style>
