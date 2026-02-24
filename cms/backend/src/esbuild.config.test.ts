import * as fs from 'fs';
import * as path from 'path';

describe('esbuild configuration', () => {
  const configPath = path.join(__dirname, '..', 'esbuild.config.js');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf8');
  });

  test('uses src/lambda.ts as entry point', () => {
    expect(configContent).toContain("entryPoints: ['src/lambda.ts']");
  });

  test('targets Node.js 20', () => {
    expect(configContent).toContain("target: 'node20'");
  });

  test('outputs to dist/lambda.js', () => {
    expect(configContent).toContain("outfile: 'dist/lambda.js'");
  });

  test('excludes @aws-sdk/* as external', () => {
    expect(configContent).toContain("'@aws-sdk/*'");
  });

  test('marks sharp as external', () => {
    expect(configContent).toMatch(/external:\s*\[[\s\S]*'sharp'[\s\S]*\]/);
  });

  test('marks @img/sharp-linux-x64 as external for Lambda compatibility', () => {
    expect(configContent).toContain("'@img/sharp-linux-x64'");
  });

  test('enables minification', () => {
    expect(configContent).toContain('minify: true');
  });

  test('enables sourcemaps', () => {
    expect(configContent).toContain('sourcemap: true');
  });

  test('sets platform to node', () => {
    expect(configContent).toContain("platform: 'node'");
  });

  test('enables bundling', () => {
    expect(configContent).toContain('bundle: true');
  });

  test('build produces output files', () => {
    const bundlePath = path.join(__dirname, '..', 'dist', 'lambda.js');
    const sourcemapPath = path.join(__dirname, '..', 'dist', 'lambda.js.map');

    expect(fs.existsSync(bundlePath)).toBe(true);
    expect(fs.existsSync(sourcemapPath)).toBe(true);
  });
});
