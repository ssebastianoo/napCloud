<script lang="ts">
	import { onMount } from 'svelte';
	import { contextMenu, filesStore, filesVisibility } from '$lib/store';

	let isFileVisible = false;
	let loaded = false;

	contextMenu.subscribe(async (value) => {
		if (value.show) {
			loaded = false;
			isFileVisible = await getFileVisibility($contextMenu.file);
			loaded = true;
		}
	});

	async function getFileVisibility(filePath: string) {
		if ($filesVisibility[filePath] != undefined) return $filesVisibility[filePath];

		const res = await fetch('/api/visibility?path=' + encodeURIComponent(filePath), {
			method: 'GET'
		});
		const json = await res.json();
		$filesVisibility[filePath] = json.visible;
		return json.visible;
	}

	async function deleteFile() {
		const res = await fetch('/api/delete', {
			method: 'DELETE',
			body: JSON.stringify({
				path: $contextMenu.file
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const json = await res.json();
		if (json.deleted) {
			alert('File deleted!');
			$contextMenu.show = false;
			$filesStore = $filesStore.filter((file) => file.path !== $contextMenu.file);
		}
	}

	async function setFileVisibility(visible: boolean) {
		const res = await fetch('/api/visibility', {
			method: 'POST',
			body: JSON.stringify({
				path: $contextMenu.file,
				visible
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const json = await res.json();
		if (json.success) {
			$filesVisibility[$contextMenu.file] = visible;
			$contextMenu.show = false;
		}
	}
</script>

{#if $contextMenu.show}
	<div class="context-menu" style={`--x: ${$contextMenu.x}px;--y: ${$contextMenu.y}px`}>
		{#if loaded}
			{#if isFileVisible}
				<div
					class="item"
					on:keydown
					on:click|preventDefault={() => {
						setFileVisibility(false);
					}}
				>
					<button>Hide</button>
				</div>
			{:else}
				<div
					class="item"
					on:keydown
					on:click|preventDefault={() => {
						setFileVisibility(true);
					}}
				>
					<button>Show</button>
				</div>
			{/if}
		{:else}
			<div class="item">
				<button>...</button>
			</div>
		{/if}
		<div class="item" on:keydown on:click|preventDefault={deleteFile}>
			<button>Delete</button>
		</div>
	</div>
{/if}

<style lang="scss">
	.context-menu {
		z-index: 999;
		position: absolute;
		top: var(--y);
		left: var(--x);
		// background-color: rgba(0, 0, 0, 0.8);

		button {
			margin: 0;
			padding: 5px;
			border-radius: 5px;
			cursor: pointer;
		}
	}
</style>
