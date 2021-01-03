import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import visualizer from 'rollup-plugin-visualizer';
import del from 'rollup-plugin-delete';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
// import multi from '@rollup/plugin-multi-entry';
/**
 * TODO remove unused plugins
 */
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const reactgrid = 'src/reactgrid.ts';
const reactgridCore = 'src/core/index.ts'
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
        input: reactgridCore,
        output: {
            file: 'dist/core/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
        ],
    },
    {
        input: reactgridCore,
        output: {
            file: 'dist/core/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
        ],
    },
    {
        input: reactgrid,
        output: {
            file: 'dist/' + pkg.module,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
            visualizer({
                filename: 'stats.reactgrid.esm.html'
            }),
        ],
    },
    {
        input: reactgrid,
        output: {
            file: 'dist/' + pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
            visualizer({
                filename: 'stats.reactgrid.html'
            }),
        ],
    },
    {
        input: "./dist/reactgridProExports.d.ts",
        output: [
            { file: './dist/core/reactgrid.d.ts', format: "es" }
        ],
        plugins: [
            dts(),
        ],
    },
    {
        input: "./dist/lib/index.d.ts",
        output: [
            { file: './dist/reactgrid.d.ts', format: "es" }
        ],
        plugins: [
            dts(),
        ],
    },
];

rollupConfig[0].plugins.push(...executeOncePlugins);

export default rollupConfig;
