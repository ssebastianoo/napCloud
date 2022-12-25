<script lang="ts">
	import type { File } from '$lib/utils';
	import { filesStore, contextMenu } from './store';
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

	function handleClick(file: File) {
		if (file.folder) window.location.href = `/drive/${file.path}`;
		else window.open(`/file/${file.path}`, '_blank');
	}

	export function clickOutside(node: any) {
		const handleClick = (event: Event) => {
			const target = event.target as HTMLElement;
			if (node && !node.contains(target) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside', node));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class="files">
	{#each files as file}
		<div
			on:contextmenu|preventDefault={(e) => {
				$contextMenu = {
					x: e.clientX,
					y: e.clientY,
					show: true,
					file: file.path
				};
			}}
			on:click={() => {
				$contextMenu = {
					x: 0,
					y: 0,
					show: false,
					file: ''
				};
			}}
			class={'file ' + (file.folder ? 'type-folder' : 'type-file')}
			on:click|preventDefault={() => {
				handleClick(file);
			}}
			on:keypress|preventDefault
		>
			<p>{file.name}</p>
			<img class="cover" src={getIcon(file)} alt={file.name} />
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
			cursor: pointer;

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
