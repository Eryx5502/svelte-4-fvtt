# Svelte and FoundryVTT

This is a simple example on building user interfaces for [FoundryVtt](https://foundryvtt.com/) with [Svelte](https://svelte.dev/). This repo is a fork from [aMediocreDad/svelte-4-fvtt](https://github.com/aMediocreDad/svelte-4-fvtt), which got me started. As in the original repo, we focus on a very simple implementation of a character sheet, since is this shows the interaction between Svelte components and Foundry's API for data binding. This is a convolute example since the purpose of sheets is to input Character (or Item) data, but it should be easier to apply similar ideas to applications which manipulate data not so related with Foundry internals.

We all know the benefits of frameworks. In particular, the possibility of making the apt react to changes in the represented data is the core of most modern apps. In Foundry, user interfaces are build with Handlebars and (two-way) data binding is accomplished through two different properties in HTML elements, as in
```html
<input type='text' name='name' value='{{actor.name}}' />
```
This is particularly inconvenient for more complex scenarios since each of the two references to the data are different. That, together with the fact that Handlebars syntax tends to get cumbersome when the interface complexity grows makes convenient to have a JS framework at hand.

## Why Svelte?

There are other approaches out there which were the starting point to the one in this repository:
1. [Sunspots](https://sunspots.eu/posts/foundry-svelte/) provides some basic ideas on how to use Svelte as a front-end framework for FoundryVtt.
2. [aMediocreDad/svelte-4-fvtt](https://github.com/aMediocreDad/svelte-4-fvtt) provides a boilerplate initialising **Svelte** as a front-end framework for Foundry VTT. The integration is light and relies on Foundry's built-in hydration and store methods.
3. [Jsavko](https://github.com/jsavko/) has two different systems built using Svelte: [MouseGuard](https://github.com/jsavko/mouseguard) and [Quest](https://github.com/jsavko/foundryvtt-quest). This are the only two complete, usable game systems built using Svelte I've seen.

The ideas in the two first examples got me started, but they only solved part of the problems which were pushing me to use a framework: they still used Foundry's bindings. Instead, Jsavko's systems use Svelte bindings and therefore we are going to use his ideas as a starting point.

## Rendering the sheet

Injecting a Svelte component is an easy task:
```typescript
import SvelteSheet from "./character-sheet.svelte";

let app = new SvelteSheet({
  target: element,
  props: {
    store: this.dataStore
  }
});
```
We only need to specify a target element already on the HTML, and Svelte will replace it with our component. Having this in mind, our strategy will be to overwrite the `ActorSheet.render` method so that:
1. The regular `ActorSheet.render` method is called only once, on the first time the sheet is rendered. Then, we replace the whole form of the sheet is used as target for our Svelte component.
2. Whenever the `render` method is called again after the first time, instead of rendering the app what we are going to do is to refresh the data of the component (see next section about how this is accomplished).

This is how we implemented in `./src/module/actor/character-sheet.ts`.

### Stores for reactivity

One of the problems we need to address is reactivity, which is a must in our implementation. There are several ways of doing this, but we are going to use [Svelte stores](https://svelte.dev/docs#run-time-svelte-store) to implement it.

Let's first review the problem. The actor sheet displays actor data, whose persistent part is stored in the server database and whose derived part is calculated through `Actor.prepareData`, and is available on `Actor.data.data`. Note that some specific data such as an actor's name and image are accessible from `Actor.name` and `actor.img` also. An actor's data can be updated from processes and modules both from the local client or other clients connected to the same game, through `Actor.update` method. In order to get a reactive sheet, we need to ensure the following:

1. Actor's data has to be available to its sheet.
2. Whenever actor's data is updated through `Actor.update`, the sheet should be notified and redraw accordingly.
3. Whenever actor's data is modified through its sheet, `Actor.update` should be called propagating the changes to all the parts.

Our implementation relies on the fact that, whenever `Actor.update` is called, the `ActorSheet.render` method is called again. We use this to update data in the store: whenever the `render` method is called after our component was injected, instead of rendering what we do is to update the data in the `ActorSheet.dataStore`. This way, updated Actor's data is always available to the SvelteSheet component. Svelte store integration takes care of keep the sheet updated accordingly.

On the other hand, in order to keep the Actor's data updated through all parties, we call `Actor.update` whenever new data is stored through `ActorSheet.dataStore.set`. This serves two purposes, but before we explain them let us remember how the `Actor.update` method works. It propagates incremental data to all the parties (and saves them on the server database), and it returns (a promise resolving to) an instance of the updated `Actor` **whenever actual changes were made**. If the actor already contained the submitted changes, then it returns `undefined` instead. Using this behaviour we can differentiate when we need to update our data and when we don't, avoiding ending on an infinite loop.

There is one particularity: when we set a "new" value to the `dataStore` from the `render` method in order to update the sheet after the actor being `.update`d, we need to bypass our protection and update the store data anyway, since `Actor.update` is going to be called with the data already existent in the actor. This, according to our previous discussion would lead to no update of the store and therefore the sheet would remain unchanged. In order to allow this *forced* update of the store, we added a `force` argument to the `DataStore.set` method.

<!-- ## How-To -->

<!-- 1. Download the repository to a folder. -->
<!--     ```bash -->
<!--     git clone git@github.com:aMediocreDad/svelte-4-fvtt.git -->
<!--     ``` -->
<!-- 2. Install dependencies. -->

<!--     ```bash -->
<!--     npm ci -->

<!--     #Because the repository contains a package-lock.json this is the best way to do it. -->
<!--     ``` -->

<!-- 3. Build and watch. -->

<!--     ```bash -->
<!--     npm start -->
<!--     ``` -->

<!-- 4. Build for production. -->

<!--     ```bash -->
<!--     npm run build -->
<!--     ``` -->

<!-- 5. Link the dist folder to your foundryVTT data folder. -->

<!-- ```bash -->
<!-- # Unix -->
<!-- ln -s dist/* /absolute/path/to/foundry/data/system-name -->

<!-- # cmd -->
<!-- mklink /J /absolute/path/to/link /absolute/path/to/this/repo/dist -->

<!-- ``` -->

<!-- ## Contributing -->

<!-- I very much welcome any and all contributions to give this boilerplate a deeper integration with Foundry so it can leverage even more of the cool features of Svelte. -->

<!-- ## License -->

<!-- This boilerplate is **Copyright (c) 2021 Ambrosius** and licensed under **MIT**. See **LICENSE** in the repository. -->

<!-- > ### ~_HAVE FUN!_ -->
