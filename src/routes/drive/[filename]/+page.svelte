<script lang="ts">
	import Drop from '$lib/Drop.svelte';
	import Files from '$lib/Files.svelte';
	import Context from '$lib/Context.svelte';
	import { contextMenu } from '$lib/store';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let showBack = false;

	onMount(() => {
		if (!window.location.href.endsWith('~')) {
			showBack = true;
		}
	});

	export let data: PageData;
	const files = data.files;
</script>

<svelte:body
	on:click={() => {
		$contextMenu.show = false;
	}}
/>
<Context />

{#if showBack}
	<button
		on:click|preventDefault={() => {
			location.href = '../';
		}}>back</button
	>
{/if}

<Drop />
<Files {files} />
