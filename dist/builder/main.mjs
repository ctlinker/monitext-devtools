// src/builder/lib/bundle.ts
import { build } from "esbuild";
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
        await build(esbuildOpts);
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
import { build as build2 } from "tsup";
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
    await build2(tsupOptions);
    console.log(`\x1B[32m\u2705 Declaration file generated:\x1B[0m ${config.outfile}`);
  } catch (err) {
    console.error("\x1B[31m\u274C DTS generation failed:\x1B[0m", err);
    return false;
  }
  return true;
}
export {
  Bundle,
  GenerateDts
};
