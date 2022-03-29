import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy-watch";

import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    sourcemap: !production && true,
    format: "es",
    name: "app",
    dir: "dist",
    // preserveModules: !production,
    // preserveModulesRoot: "src"
    // file: "dist/main.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        // enableSourcemap: !production,
        // accessors: true,
      },
    }),
    typescript({ sourceMap: !production }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "main.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    copy({
      targets: [{ src: ["./src/*", "!./**/*.ts", "!./src/module"], dest: "./dist" }],
      copyOnce: true,
      watch: !production && "./src",
      verbose: true,
    }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("src"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser({ mangle: false }),
  ],
  watch: {
    clearScreen: false,
  },
};
