import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import pkg from "./package.json";

// const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/reactgrid.ts";

const plugins = [
    typescript({
        typescript: require("typescript"),
        useTsconfigDeclarationDir: true,
    }),
    external(),
    postcss(),
    resolve(),
    commonjs(),
    visualizer()
];

const rollupConfig = [
    {
        input,
        output: {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
    },
    {
        input,
        output: {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
    },
]

export default rollupConfig;
