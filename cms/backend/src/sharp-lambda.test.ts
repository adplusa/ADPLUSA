import * as fs from 'fs';
import * as path from 'path';

describe('Sharp Lambda Configuration', () => {
  const backendRoot = path.join(__dirname, '..');

  test('package.json has @img/sharp-linux-x64 in optionalDependencies', () => {
    const pkgPath = path.join(backendRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.optionalDependencies).toBeDefined();
    expect(pkg.optionalDependencies['@img/sharp-linux-x64']).toBeDefined();
  });

  test('package.json sharp and @img/sharp-linux-x64 versions are compatible', () => {
    const pkgPath = path.join(backendRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const sharpVersion = pkg.dependencies.sharp;
    const linuxSharpVersion = pkg.optionalDependencies['@img/sharp-linux-x64'];

    // Both should use the same major.minor version range
    expect(sharpVersion).toBeDefined();
    expect(linuxSharpVersion).toBeDefined();

    // Extract the numeric version (strip ^ or ~ prefix)
    const sharpNumeric = sharpVersion.replace(/^[\^~]/, '');
    const linuxNumeric = linuxSharpVersion.replace(/^[\^~]/, '');

    // Major and minor versions should match
    const [sharpMajor, sharpMinor] = sharpNumeric.split('.');
    const [linuxMajor, linuxMinor] = linuxNumeric.split('.');
    expect(sharpMajor).toBe(linuxMajor);
    expect(sharpMinor).toBe(linuxMinor);
  });

  test('install-sharp-lambda.js script exists', () => {
    const scriptPath = path.join(backendRoot, 'scripts', 'install-sharp-lambda.js');
    expect(fs.existsSync(scriptPath)).toBe(true);
  });

  test('build:lambda script includes sharp installation step', () => {
    const pkgPath = path.join(backendRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.scripts['build:lambda']).toContain('install-sharp-lambda');
  });

  test('esbuild config marks both sharp and @img/sharp-linux-x64 as external', () => {
    const configPath = path.join(backendRoot, 'esbuild.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    expect(configContent).toContain("'sharp'");
    expect(configContent).toContain("'@img/sharp-linux-x64'");
  });

  test('template.yaml specifies x86_64 architecture for Lambda', () => {
    const templatePath = path.join(backendRoot, 'template.yaml');
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    expect(templateContent).toContain('x86_64');
  });

  test('dist/node_modules contains sharp with Linux x64 binaries after build', () => {
    // This test validates the build output - only runs if dist exists
    const distNodeModules = path.join(backendRoot, 'dist', 'node_modules');
    if (!fs.existsSync(distNodeModules)) {
      // Skip if dist hasn't been built yet
      console.log('Skipping: dist/node_modules not found (run build:lambda first)');
      return;
    }

    // Verify sharp package exists
    const sharpDir = path.join(distNodeModules, 'sharp');
    expect(fs.existsSync(sharpDir)).toBe(true);

    // Verify Linux x64 native binary exists
    const linuxBinaryDir = path.join(distNodeModules, '@img', 'sharp-linux-x64');
    expect(fs.existsSync(linuxBinaryDir)).toBe(true);

    // Verify the .node native addon exists
    const nativeAddon = path.join(linuxBinaryDir, 'lib', 'sharp-linux-x64.node');
    expect(fs.existsSync(nativeAddon)).toBe(true);
  });
});
