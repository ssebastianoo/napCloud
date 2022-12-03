<script lang="ts">
	import Drop from '$lib/Drop.svelte';
	import Files from '$lib/Files.svelte';
	import type { PageData } from '../$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	const files = data.files;
</script>

<Drop />
<Files {files} />
