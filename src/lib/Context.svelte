<script lang="ts">
	import { contextMenu, filesStore } from '$lib/store';

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
</script>

{#if $contextMenu.show}
	<div class="context-menu" style={`--x: ${$contextMenu.x}px;--y: ${$contextMenu.y}px`}>
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
