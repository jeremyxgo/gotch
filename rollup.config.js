import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = {
  input: 'src',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name,
    },
    {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: pkg.name,
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    babel(),
    resolve(),
    terser({
      include: /^.+\.(min|esm)\.js$/,
    }),
  ],
};

export default config;
