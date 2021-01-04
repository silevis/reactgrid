import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import del from 'rollup-plugin-delete';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const reactgrid = 'src/reactgrid.ts';
const reactgridCore = 'src/core/index.ts'
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

const plugins = [
    replace({
        'process.env.NODE_ENV': NODE_ENV
    }),
    typescript({
        typescript: require('typescript'),
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.prod.json',
        exclude: ['src/test/**/*'],
    }),
    externals({
        devDeps: false,
    }),
    resolve(),
    commonjs(),
    scss({
        output: 'dist/styles.css',
        include: ['src/styles.scss'],
    }),
    terser({
        format: {
            comments: false,
        },
        compress: true,
        keep_classnames: true,
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
        ],
    },
    {
        input: './dist/types/reactgridProExports.d.ts',
        output: [
            { file: './dist/core/reactgrid.d.ts', format: 'es' }
        ],
        plugins: [
            dts(),
        ],
    },
    {
        input: './dist/types/lib/index.d.ts',
        output: [
            { file: './dist/reactgrid.d.ts', format: 'es' }
        ],
        plugins: [
            dts(),
        ],
    },
];

rollupConfig[0].plugins.push(...executeOncePlugins);

export default rollupConfig; 
