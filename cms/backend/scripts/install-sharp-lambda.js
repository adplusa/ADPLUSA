/**
 * Script to install sharp's Linux x64 native binaries into the dist/node_modules
 * directory for Lambda deployment.
 *
 * Sharp uses platform-specific native binaries. When building on macOS or Windows,
 * the local sharp installation contains binaries for the dev platform. Lambda runs
 * on Amazon Linux 2023 (x86_64), so we need the Linux x64 binaries.
 *
 * This script:
 * 1. Creates a minimal package.json in dist/ with sharp as a dependency
 * 2. Runs npm install with --os=linux --cpu=x64 to fetch Linux binaries
 * 3. Cleans up the temporary package.json
 *
 * Usage: node scripts/install-sharp-lambda.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read the root package.json to get the sharp version
const rootPkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);
const sharpVersion = rootPkg.dependencies.sharp || '^0.34.5';

console.log(`Installing sharp@${sharpVersion} with Linux x64 binaries into dist/...`);

// Create a minimal package.json in dist/ for npm install
const distPkg = {
  name: 'lambda-sharp-deps',
  version: '1.0.0',
  private: true,
  dependencies: {
    sharp: sharpVersion,
  },
};

const distPkgPath = path.join(distDir, 'package.json');
fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));

try {
  // Install sharp with Linux x64 platform override
  // This forces npm to download the @img/sharp-linux-x64 binary
  execSync(
    'npm install --os=linux --cpu=x64 --omit=dev',
    {
      cwd: distDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_platform: 'linux',
        npm_config_arch: 'x64',
      },
    }
  );
  console.log('✅ Sharp Linux x64 binaries installed successfully in dist/node_modules');
} catch (error) {
  console.error('❌ Failed to install sharp Linux binaries:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary package.json and package-lock.json from dist/
  if (fs.existsSync(distPkgPath)) {
    fs.unlinkSync(distPkgPath);
  }
  const distLockPath = path.join(distDir, 'package-lock.json');
  if (fs.existsSync(distLockPath)) {
    fs.unlinkSync(distLockPath);
  }
}
