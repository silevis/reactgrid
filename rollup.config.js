import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import visualizer from 'rollup-plugin-visualizer';
/**
 * TODO remove unused plugins
 */
// import postcss from 'rollup-plugin-postcss';
// import dts from "rollup-plugin-dts";
// import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";

// const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/reactgrid.ts";

const plugins = [
    typescript({
        typescript: require("typescript"),
        useTsconfigDeclarationDir: true,
        exclude: ['src/test/**/*'],
    }),
    external(),
    resolve(),
    commonjs(),
    visualizer(),
    scss({
        output: 'dist/styles.css',
        include: ['src/styles.scss'],
    }),
    // postcss(),
    // dts({}),
    // terser({
    //     compress: true,
    //     keep_classnames: true,
    // }),
];

const rollupConfig = [
    {
        input,
        output: {
            file: 'dist/' + pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
    },
    {
        input,
        output: {
            file: 'dist/' + pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
    },
]

export default rollupConfig;
