<script lang="ts">
	import type { File } from '$lib/utils';
	import { filesStore, contextMenu } from './store';
	import { onMount } from 'svelte';
	import CreateFolder from '$lib/CreateFolder.svelte';

	export let files: File[];

	onMount(() => {
		filesStore.set(files);
		filesStore.subscribe((value) => {
			if (value != files) files = value;
		});
	});

	function getIcon(file: File) {
		if (file.folder) return '/folder.png';
		const ext = file.name.split('.').pop();
		if (ext && ['png', 'jpg', 'jpeg'].includes(ext.toLowerCase())) {
			return `/file/${file.path}`;
		}
		return '/default-file.png';
	}

	function handleClick(file: File) {
		if (file.folder) window.location.href = `/drive/${file.path}`.replaceAll('//', '/');
		else window.open(`/file/${file.path}`.replaceAll('//', '/'), '_blank');
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

<CreateFolder />
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
			class={'file ' + (file.folder ? 'type-folder' : 'type-file')}
			on:click|preventDefault={() => {
				$contextMenu = {
					x: 0,
					y: 0,
					show: false,
					file: ''
				};
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
