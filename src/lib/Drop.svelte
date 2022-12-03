<script lang="ts">
	let hovering = false;

	function handleDrop(e: DragEvent) {
		hovering = false;
		console.log(e.dataTransfer?.files);
		if (e.dataTransfer && e.dataTransfer.files.length > 0) {
			// fetch('/api/upload', {
			// 	method: 'POST',
			// 	body: e.dataTransfer.files[0]
			// });

			// senf form data
			const formData = new FormData();
			formData.append('file', e.dataTransfer.files[0]);

			fetch('/api/upload', {
				method: 'POST',
				body: formData
			})
				.then((res) => res.json())
				.then((data) => {
					alert('File uploaded successfully');
				});
		}
	}
</script>

<div
	class={hovering ? 'drop hover' : 'drop'}
	on:drop|preventDefault|stopPropagation={handleDrop}
	on:dragover|preventDefault|stopPropagation={() => (hovering = true)}
	on:dragexit|preventDefault|stopPropagation={() => (hovering = false)}
>
	<p>Drop files here</p>
</div>

<style lang="scss">
	.drop {
		width: 100%;
		height: 100px;
		border: 1px solid wheat;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;

		p {
			margin: 0;
		}
	}

	.hover {
		background-color: rgba($color: #ffffff, $alpha: 0.2);
	}
</style>
