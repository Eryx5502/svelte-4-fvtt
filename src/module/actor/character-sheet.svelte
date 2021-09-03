<script>
	export let sheetData
	const { actor, data } = sheetData
	const localize = (string) => game.i18n.localize(string)

</script>

<label for="name">{localize("NAME")}</label>
<input type="text" name="name" value="{actor.name}"/>

<label for="health">{localize("ACTOR.health")}</label>
<input type="text" id="health" name="data.health.value" value="{data.health.value}"/>

<label for="power">{localize("ACTOR.power")}</label>
<input type="text" id="power" name="data.power.value" value="{data.power.value}"/>

<label for="biography">{localize("ACTOR.biography")}</label>
<textarea id="biography" name="data.biography" value="{data.biography}"/>

<br />

<p class="footer">Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

<style>
	:global(.character) {
		background: green
	}

	:global(.character > .window-content) {
		background: #fff
	}

	label {
		color: #ff3e00;
		font-size: 1.2rem;
		text-transform: uppercase;
		font-weight: 100;
	}

	input, textarea {
		background: #ddd;
		margin-bottom: 1rem;
	}

	.footer {
		text-align: center;
	}
</style>