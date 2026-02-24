const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/lambda.js',
  external: [
    '@aws-sdk/*',
    'sharp',
    '@img/sharp-linux-x64',
    'mock-aws-s3',
    'nock',
    '@mapbox/node-pre-gyp',
  ],
  minify: true,
  sourcemap: true,
});
