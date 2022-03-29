export async function preloadTemplates(system) {
	const templatePaths = [`systems/${system}/templates/character.hbs`];

	return loadTemplates(templatePaths);
}
