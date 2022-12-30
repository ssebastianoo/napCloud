<script lang="ts">
	import './global.scss';
	import { PUBLIC_ALLOW_HTTP } from '$env/static/public';
	import { onMount } from 'svelte';

	let allowed = true;
	onMount(() => {
		if (PUBLIC_ALLOW_HTTP.toLowerCase() !== 'true' && window.location.protocol === 'http:') {
			allowed = false;
		}
	});
</script>

<main>
	{#if allowed}
		<slot />
	{:else}
		<p>Please access this page over https://</p>
	{/if}
</main>

<style>
	main {
		padding: 20px;
	}
</style>
