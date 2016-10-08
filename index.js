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

// Welcome screen
log(`${chalk.black.bgBlue(' new-js-app ')} Easy way to boostrap javascript apps.\n`);

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

log(`${chalk.black.bgBlue(' new-js-app ')} ${chalk.green('Project directory created.')}\n`);

// Template files
const templateFiles = fs.readdirSync(templateDir);

for (const templateFile of templateFiles) {
  const destFrom = path.join(templateDir, templateFile);
  const destTo = path.join(dirToCreatePath, templateFile);

  fs.writeFileSync(destTo, fs.readFileSync(destFrom));

  log(`${chalk.black.bgBlue(' new-js-app ')} ${chalk.green(`Creating ${templateFile}... OK`)}\n`);
}

// Running eslint installation
log(`${chalk.black.bgBlue(' new-js-app ')} ${chalk.green('Installing eslint config...')}\n`);
execSync(
  'npm info eslint-config-airbnb peerDependencies --json | ' +
  'command sed \'s/[\{\},]//g ; s/: /@/g\' | xargs npm install --save-dev eslint-config-airbnb', { // eslint-disable-line
    cwd: dirToCreatePath,
  });
log(`${chalk.black.bgBlue(' new-js-app ')} ${chalk.green('Finished installing eslint config!')}\n`);

log('\n');
