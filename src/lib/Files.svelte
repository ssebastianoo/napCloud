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
</script>

<div class="files">
	{#each files as file}
		<div class="file">
			<p>{file.name}</p>
			<img class="cover" src={file.cover ? file.cover : '/default-file.png'} alt={file.name} />
		</div>
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

			p {
				padding: 5px;
				margin: 0;
				position: absolute;
				bottom: 0;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.5);
			}

			.cover {
				height: 100%;
			}
		}
	}
</style>
