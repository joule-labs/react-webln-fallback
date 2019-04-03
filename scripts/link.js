const path = require("path");
const execSync = require("child_process").execSync;

function exec(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd();

const mainPackage = 'react-webln-fallback';
const subPackages = ['react-webln-fallback-antd'];
const allPackages = ['react-webln-fallback', ...subPackages];

// Build & link the main package
console.log(`Building and linking ${mainPackage}...`);
process.chdir(path.resolve(__dirname, '../packages', mainPackage));
exec('yarn && yarn build && yarn link');

// Link main package to sub-packages, build and link them too
subPackages.forEach(
  packageName => {
    process.chdir(path.resolve(__dirname, '../packages/', packageName));
    console.log(`Building and linking ${packageName}...`);
    exec(`yarn && yarn link ${mainPackage} && yarn build && yarn link`);
  }
);

// Link demo to all packages
console.log('Linking all packages to demo...');
process.chdir(path.resolve(__dirname, '../demo'));
exec(`yarn link ${allPackages.join(' ')}`);

process.chdir(cwd);
