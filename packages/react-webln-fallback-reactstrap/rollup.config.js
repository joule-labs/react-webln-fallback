import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import localResolve from 'rollup-plugin-local-resolve';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

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
  plugins: [
    typescript(),
    peerDepsExternal(),
    localResolve(),
    nodeResolve(),
    commonjs(),
    json(),
  ],
}];
