"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/builder/main.ts
var main_exports = {};
__export(main_exports, {
  Bundle: () => Bundle,
  GenerateDts: () => GenerateDts
});
module.exports = __toCommonJS(main_exports);

// src/builder/lib/bundle.ts
var import_esbuild = require("esbuild");
async function Bundle(config) {
  if (!config.targets?.length) {
    console.warn("\x1B[33m\u26A0\uFE0F  No bundle targets provided.\x1B[0m");
    return false;
  }
  for (const target of config.targets) {
    const variants = target.variant ?? ["esm"];
    for (const v of variants) {
      const esbuildOpts = {
        entryPoints: [target.entry],
        outfile: target.outfile.replace(/\.js$/, `.${v}.js`),
        format: v,
        platform: target.options.plateform,
        tsconfig: target.options.tsconfig,
        bundle: true,
        minify: !!target.options.minify,
        minifySyntax: target.options.minifySyntax ?? void 0,
        minifyWhitespace: target.options.minifyWhitespace ?? void 0,
        minifyIdentifiers: target.options.minifyIdentifiers ?? void 0,
        ...target.extraOpts ?? {}
      };
      console.log(
        `\x1B[36m\u27A1\uFE0F  Building\x1B[0m \x1B[1m${target.entry}\x1B[0m \u2192 \x1B[32m${esbuildOpts.outfile}\x1B[0m (\x1B[35m${v}\x1B[0m)`
      );
      try {
        await (0, import_esbuild.build)(esbuildOpts);
        console.log(
          `\x1B[32m\u2705 Successfully built\x1B[0m ${target.entry} \u2192 ${esbuildOpts.outfile}`
        );
      } catch (err) {
        console.error("\x1B[31m\u274C Bundle step failed:\x1B[0m", err);
        return false;
      }
    }
  }
  return true;
}

// src/builder/lib/dts.ts
var import_tsup = require("tsup");
async function GenerateDts(config) {
  if (!config.entry || !config.outfile) {
    console.warn("\x1B[33m\u26A0\uFE0F DTS step requires entry and outfile.\x1B[0m");
    return false;
  }
  console.log(
    `\x1B[36m\u27A1\uFE0F  Generating DTS\x1B[0m \x1B[1m${config.entry}\x1B[0m \u2192 \x1B[32m${config.outfile}\x1B[0m`
  );
  const tsupOptions = {
    entry: [config.entry],
    dts: true,
    outDir: config.outfile.replace(/\/?[^/]+$/, ""),
    format: ["cjs", "esm"],
    minify: false,
    clean: false,
    tsconfig: config.tsconfig,
    splitting: false
    // optional,
  };
  try {
    await (0, import_tsup.build)(tsupOptions);
    console.log(`\x1B[32m\u2705 Declaration file generated:\x1B[0m ${config.outfile}`);
  } catch (err) {
    console.error("\x1B[31m\u274C DTS generation failed:\x1B[0m", err);
    return false;
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Bundle,
  GenerateDts
});
