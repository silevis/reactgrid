import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import visualizer from 'rollup-plugin-visualizer';
import del from 'rollup-plugin-delete';
import replace from 'rollup-plugin-replace';
/**
 * TODO remove unused plugins
 */
// import postcss from 'rollup-plugin-postcss';
// import dts from "rollup-plugin-dts";
// import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";

// const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/reactgrid.ts";
const NODE_ENV = process.env.NODE_ENV || "development";

const plugins = [
    replace({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    typescript({
        typescript: require("typescript"),
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.prod.json',
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
        plugins: [
            ...plugins,
            del({ targets: ['dist/*'] }),
        ],
    },
    {
        input,
        output: {
            file: 'dist/' + pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins: [
            ...plugins,
        ],
    },
]

export default rollupConfig;
