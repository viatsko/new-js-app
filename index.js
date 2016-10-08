#!/usr/bin/env node

// Dependencies
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

// Utils
function log(inputString) {
  process.stdout.write(inputString);
}

// Some consts
const workingDir = process.cwd();
const templateDir = path.resolve(__dirname, 'template');
const newJsAppBanner = chalk.black.bgBlue(' new-js-app ');

// Welcome screen
log(`${newJsAppBanner}\n`);
log(`${newJsAppBanner} Easy way to boostrap javascript apps.\n`);
log(`${newJsAppBanner}\n`);

// Trying to fetch some information about user
let gitUserName;
try {
  gitUserName = execSync('git config --get user.name', { encoding: 'utf8' }).trim();

  log(`${newJsAppBanner} git user.name = ${gitUserName}\n`);
} catch (e) {
  // Ignored
}

let gitUserEmail;
try {
  gitUserEmail = execSync('git config --get user.email', { encoding: 'utf8' }).trim();
  log(`${newJsAppBanner} git user.email = ${gitUserEmail}\n`);
} catch (e) {
  // Ignored
}

if (gitUserName || gitUserEmail) {
  log(`${newJsAppBanner}\n`);
}

// Checking for the dir argument
let dirToCreate;

for (const arg of process.argv) {
  if (arg.trim() !== '') {
    dirToCreate = arg;
  }
}

// Checking if project directory already exists
const dirToCreatePath = path.join(workingDir, dirToCreate);
try {
  fs.statSync(dirToCreatePath);

  log(`${chalk.white.bgRed(`Tried to create directory ${dirToCreate}, but it already exists.`)}`);

  process.exit(1);
} catch (e) {
  // Ignored
}

// Creating directory for the new project
fs.mkdirSync(dirToCreatePath);

log(`${newJsAppBanner} ${chalk.green('Project directory created.')}\n`);

// Template files
const templateFiles = fs.readdirSync(templateDir);

for (const templateFile of templateFiles) {
  const destFrom = path.join(templateDir, templateFile);
  const destTo = path.join(dirToCreatePath, templateFile);

  fs.writeFileSync(destTo, fs.readFileSync(destFrom));

  log(`${newJsAppBanner} ${chalk.green(`Creating ${templateFile}... OK`)}\n`);
}

// Replacing some stuff in package.json
const packageJsonPath = path.join(dirToCreatePath, 'package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

packageJson.name = dirToCreate;
packageJson.author = `${gitUserName} <${gitUserEmail}>`;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

log(`${newJsAppBanner} ${chalk.green('Updating package.json... OK')}\n`);

// Replacing author name in LICENSE file
const licensePath = path.join(dirToCreatePath, 'LICENSE');

fs.writeFileSync(licensePath,
  fs.readFileSync(licensePath, { encoding: 'utf8' }).replace(/##AUTHOR##/, gitUserName)
);

log(`${newJsAppBanner} ${chalk.green('Updating LICENSE... OK')}\n`);

// Running jest installation
log(`${newJsAppBanner} ${chalk.green('Installing jest...')}\n`);
execSync(
  'npm install jest-cli --save-dev', {
    cwd: dirToCreatePath,
  });
log(`${newJsAppBanner} ${chalk.green('Finished installing jest!')}\n`);

// Running eslint installation
log(`${newJsAppBanner} ${chalk.green('Installing eslint config...')}\n`);
execSync(
  'npm info eslint-config-airbnb peerDependencies --json | ' +
  'command sed \'s/[\{\},]//g ; s/: /@/g\' | xargs npm install --save-dev eslint-config-airbnb', { // eslint-disable-line
    cwd: dirToCreatePath,
  });
log(`${newJsAppBanner} ${chalk.green('Finished installing eslint config!')}\n`);

// Finished

log(`${newJsAppBanner}\n`);
log(`${newJsAppBanner} Your app created. Happy coding!\n`);
log(`${newJsAppBanner}\n`);

log('\n');
