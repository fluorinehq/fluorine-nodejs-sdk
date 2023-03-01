// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, sourcemap: true, format: 'cjs' },
    { file: pkg.module, sourcemap: true, format: 'es' },
  ],
  plugins: [typescript()],
}
