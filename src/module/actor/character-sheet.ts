import SvelteSheet from "./character-sheet.svelte";
import { dataStore, type DataStore } from "../../svelte/store";

// TODO: for type safety, add type for data (ActorDataSource or ActorData, check League of Foundry types wiki)
export type Data = {
  name: string,
  img: string | null,
  data: Object
};


export class CharacterSheet extends ActorSheet {
  app?: SvelteSheet;
  dataStore?: DataStore<Data, Actor>;

  constructor(actor: Actor, options?: Partial<ActorSheet.Options>) {
    super(actor, options);
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

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions<ActorSheet.Options>) {
    if (!options) options = {};

    // First time rendering
    if (!this.app) {
      // Run the normal Foundry render once.
      this._render(force, options)
        .catch((err) => {
          err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
          console.error(err);
          this._state = Application.RENDER_STATES.ERROR;
        })
        // Run Svelte's render, assign it to our prop for tracking.
        .then((rendered) => {
          this.dataStore = dataStore(this.getSheetData(), this.actor as Actor);

          console.log('SvelteRender | Creating app element')
          this.app = new SvelteSheet({
            target: this.element.find("form").get(0),
            props: {
              store: this.dataStore
            }
          });
        });
    } else {
      this.dataStore!.set(this.getSheetData(), force = true)
      console.log('SvelteRender | Render was called, but this.app exists')
    }

    // Update editable permission
    options.editable = options.editable ?? this.object.isOwner;

    // Register the active Application with the referenced Documents
    this.object.apps[this.appId] = this;
    // Return per the overridden method.
    return this;
  }

  close(options = {}) {
    if (this.app) {
      delete this.object.apps[this.appId];

      this.app.$destroy();
      delete this.app;
      this.dataStore?.destroy();
      delete this.dataStore;
    }
    return super.close(options);
  }

  getSheetData() {
    return {
      img: this.actor.data.img,
      name: this.actor.data.name,
      data: this.actor.data.data
    };
  }
}
