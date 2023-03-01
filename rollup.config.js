// rollup.config.js
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, sourcemap: true, format: 'cjs' },
    { file: pkg.module, sourcemap: true, format: 'es' },
  ],
  plugins: [commonjs(), nodeResolve(), typescript()],
}
