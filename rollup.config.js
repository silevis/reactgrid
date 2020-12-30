import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import visualizer from 'rollup-plugin-visualizer';
import del from 'rollup-plugin-delete';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
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
        // useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.prod.json',
        exclude: ['src/test/**/*'],
    }),
    external(),
    resolve(),
    commonjs(),
    scss({
        output: 'dist/styles.css',
        include: ['src/styles.scss'],
    }),
    // postcss(),
    // dts({}),
];

const executeOncePlugins = [
    del({ targets: ['dist/*'] }),
    copy({
        targets: [
            { src: ['src/*.scss', 'package.json', 'README.md', 'LICENSE', '.npmignore'], dest: 'dist' },
            { src: 'src/test/theming-test.scss', dest: 'dist/test' },
            { src: 'cypress/integration', dest: 'dist/cypress' },
            { src: 'src/test/flagCell/flag-cell-style.scss', dest: 'dist/test/flagCell' },
        ]
    }),
]

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
            ...executeOncePlugins,
            visualizer({
                filename: 'stats.reactgrid.esm.html'
            }),
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
            visualizer({
                filename: 'stats.reactgrid.html'
            }),
        ],
    },
    /* {
        input,
        output: {
            file: 'dist/reactgrid.min.js',
            format: "cjs",
            sourcemap: true,
        },
        plugins: [
            ...plugins,
            visualizer({
                filename: 'stats.reactgrid.min.html',
                sourcemap: true,
            }),
            terser({
                compress: true,
                keep_classnames: true,
            }),
        ],
    }, */
]

export default rollupConfig;
