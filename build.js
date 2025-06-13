const esbuild = require('esbuild');
const gzipPlugin = require('@luncheon/esbuild-plugin-gzip');

const ctx = esbuild.build({
  entryPoints: ['src/bixi.js'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  write: false,
  plugins: [gzipPlugin({
    uncompressed: true,
    gzip: false,
    brotli: true,
  })]
});