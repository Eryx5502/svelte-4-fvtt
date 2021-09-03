# Svelte 4 FVTT

This is a boilerplate initializing **Svelte** as a front-end framework for Foundry VTT. The integration is still light and relies on Foundry's built-in hydration and store methods. In addition it attempts to be as barebones as possible so you can code the way YOU want.

## How-To

1. Download the repository to a folder.
    ```bash
    git clone git@github.com:aMediocreDad/svelte-4-fvtt.git
    ```
2. Install dependencies.

    ```bash
    npm ci

    #Because the repository contains a package-lock.json this is the best way to do it.
    ```

3. Build and watch.

    ```bash
    npm start
    ```

4. Build for production.

    ```bash
    npm run build
    ```

5. Link the dist folder to your foundryVTT data folder.

```bash
# Unix
ln -s dist/* /absolute/path/to/foundry/data/system-name

# cmd
mklink /J /absolute/path/to/link /absolute/path/to/this/repo/dist

```

## Contributing

I very much welcome any and all contributions to give this boilerplate a deeper integration with Foundry so it can leverage even more of the cool features of Svelte.

## License

This boilerplate is **Copyright (c) 2021 Ambrosius** and licensed under **MIT**. See **LICENSE** in the repository.

> ### ~_HAVE FUN!_
