<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;

	let mode = 'login';
</script>

{#if form && form.success}
	<p>success</p>
{:else}
	{#if form && !form.success}
		<p>{form.error}</p>
	{/if}
	<form method="POST" action={'?/' + mode}>
		<div class="buttons">
			<button
				class={mode === 'login' ? 'active' : ''}
				on:click|preventDefault={() => {
					mode = 'login';
				}}>login</button
			>
			<button
				class={mode === 'register' ? 'active' : ''}
				on:click|preventDefault={() => {
					mode = 'register';
				}}>register</button
			>
		</div>
		<input type="email" name="email" placeholder="email" required />
		<input type="password" name="password" placeholder="password" required />
		<!-- <input type="password" name="repeatPassword" placeholder="repeat password"  /> -->
		<input type="submit" value={mode} />
	</form>
{/if}

<style lang="scss">
	.buttons {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;

		button {
			cursor: pointer;
		}

		.active {
			border: 5px solid wheat;
			border-radius: 4px;
		}
	}
</style>
