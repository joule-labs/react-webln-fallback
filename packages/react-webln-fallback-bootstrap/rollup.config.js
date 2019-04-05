import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import localResolve from 'rollup-plugin-local-resolve';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import pkg from './package.json';

const makePlugins = (opts) => {
  return [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: !!opts.declarations,
        },
      },
    }),
    // babel({
    //   extensions: [
    //     ...DEFAULT_EXTENSIONS,
    //     'ts',
    //     'tsx'
    //   ],
    //   exclude: 'node_modules/**',
    //   runtimeHelpers: true,
    // }),
    peerDepsExternal(),
    localResolve(),
    nodeResolve(),
    commonjs(),
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
    file: 'umd/react-webln-fallback-bootstrap.js',
    format: 'umd',
    name: 'ReactWebLNFallback',
    indent: false,
  }],
  plugins: makePlugins({ declarations: false }),
}, {
  // UMD (Production)
  input: 'src/umd.tsx',
  output: [{
    file: 'umd/react-webln-fallback-bootstrap.min.js',
    format: 'umd',
    name: 'ReactWebLNFallback',
    indent: false,
  }],
  plugins: makePlugins({ declarations: false, minify: true }),
}];