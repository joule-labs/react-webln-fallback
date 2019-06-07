const path = require("path");
const execSync = require("child_process").execSync;

function exec(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd();

const corePackage = 'react-webln-fallback-core';
const subPackages = [
  'react-webln-fallback-antd',
  'react-webln-fallback-bootstrap',
  'react-webln-fallback-reactstrap',
  'react-webln-fallback-material-ui',
  'react-webln-fallback-semantic-ui',
];
const allPackages = [corePackage, ...subPackages];

// Build & link the main package
console.log(`Building and linking ${corePackage}...`);
process.chdir(path.resolve(__dirname, '../packages', corePackage));
exec('yarn && yarn build && yarn link');

// Link main package to sub-packages, build and link them too
subPackages.forEach(
  packageName => {
    process.chdir(path.resolve(__dirname, '../packages/', packageName));
    console.log(`Building and linking ${packageName}...`);
    exec(`yarn && yarn link ${corePackage} && yarn build && yarn link`);
  }
);

// Link demo to all packages
console.log('Linking all packages to demo...');
process.chdir(path.resolve(__dirname, '../demo'));
exec(`yarn link ${allPackages.join(' ')}`);

process.chdir(cwd);
