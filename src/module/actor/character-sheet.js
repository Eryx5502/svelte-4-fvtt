import FormApp from "./character-sheet.svelte";

export class CharacterSheet extends ActorSheet {
	constructor(data, options) {
		super(data, options);
		this.app = null;
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["character", "sheet", "actor"],
		});
	}

	/** @override */
	get template() {
		return `systems/svelte/templates/character.hbs`;
	}

	get actorData() {
		return this.actor.data;
	}

	getData() {
		return {
			actor: this.actorData,
			data: this.actorData.toObject().data,
		};
	}

	// Injects Svelte app when initializing HTML
	async _injectHTML(html) {
		await super._injectHTML(html);
		this.app = new FormApp({
			target: html.find("form")[0],
			props: {
				sheetData: this.getData(),
			},
		});
	}

	// Injects Svelte app when replacing innerHTML
	async _replaceHTML(element, html) {
		await super._replaceHTML(element, html);
		this.app = new FormApp({
			target: html.find("form")[0],
			props: {
				sheetData: this.getData(),
			},
		});
	}
}
