const typescript = require('rollup-plugin-typescript2');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const localResolve = require('rollup-plugin-local-resolve');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const terser = require('rollup-plugin-terser');
const pkg = require('./package.json');

const isDev = process.env.NODE_ENV !== 'production';

const makePlugins = (opts) => {
  return [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: !!opts.declarations,
        },
      },
    }),
    opts.externals && peerDepsExternal(),
    localResolve(),
    nodeResolve(),
    commonjs(opts.externals ? undefined : {
      include: [
        'node_modules/**'
      ],
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/webln/lib/errors.js': ['UnsupportedMethodError', 'RejectionError'],
      },
    }),
    json(),
    opts.minify && terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  ].filter(p => !!p);
};

module.exports = [{
  // CommonJS and ESModule
  input: 'src/index.tsx',
  output: [{
    file: pkg.main,
    format: 'cjs',
    name: 'React WebLN Fallback',
  }, {
    file: pkg.module,
    format: 'es',
  }],
  plugins: makePlugins({ declarations: true, externals: true }),
}, {
  // UMD (Development)
  input: 'src/umd.tsx',
  output: [{
    file: 'umd/react-webln-fallback.js',
    format: 'umd',
    name: 'ReactWebLNFallback',
    indent: false,
  }],
  plugins: makePlugins({ declarations: false }),
}, !isDev && {
  // UMD (Production)
  input: 'src/umd.tsx',
  output: [{
    file: 'umd/react-webln-fallback.min.js',
    format: 'umd',
    name: 'ReactWebLNFallback',
    indent: false,
  }],
  plugins: makePlugins({ declarations: false, minify: true }),
}].filter(c => !!c);
