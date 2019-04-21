import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import localResolve from 'rollup-plugin-local-resolve';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

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
      // React et al do not provide module versions, so we have to manually
      // specify their exports because rollup and CommonJS is weird.
      namedExports: {
        'node_modules/react/index.js': [
          'Children',
          'Component',
          'PropTypes',
          'createElement',
          'cloneElement',
        ],
        'node_modules/react-dom/index.js': [
          'render',
          'findDOMNode',
          'unmountComponentAtNode',
        ],
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

export default [{
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
