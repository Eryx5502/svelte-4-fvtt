import { Character } from "./module/actor/character";
import { CharacterSheet } from "./module/actor/character-sheet";
import { preloadTemplates } from "./module/preloadTemplates";

const SYSTEM_NAME = "svelte";

Hooks.once("init", async () => {
  console.log(`${SYSTEM_NAME.toUpperCase()} | Initializing ${SYSTEM_NAME.capitalize()}`);

  game[SYSTEM_NAME] = {
    Character,
  };
  CONFIG.Actor.documentClass = Character;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("Character", CharacterSheet, { makeDefault: true });

  await preloadTemplates(SYSTEM_NAME);
});
