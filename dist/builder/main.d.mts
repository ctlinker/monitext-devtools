import { BuildOptions } from 'esbuild';

type BundlingParameters = {
    mode: "file";
    targets: {
        entry: string;
        outfile: string;
        variant?: ("esm" | "cjs" | "iife")[];
        options: {
            tsconfig?: string;
            eternal?: string[];
            minify?: boolean;
            minifySyntax?: true;
            minifyWhitespace?: true;
            minifyIdentifiers?: boolean;
            plateform: "node" | "browser" | "neutral";
        };
        extraOpts?: Partial<BuildOptions>;
    }[];
};
declare function Bundle(config: BundlingParameters): Promise<boolean>;

type DtsStepParams = {
    mode: "file";
    entry: string;
    outfile: string;
    tsconfig?: string;
};
declare function GenerateDts(config: DtsStepParams): Promise<boolean>;

export { Bundle, GenerateDts };
