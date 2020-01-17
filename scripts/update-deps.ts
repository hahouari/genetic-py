import * as child_process from 'child_process';
import * as fs from 'fs';
import * as readline from 'readline';
import { join } from 'path';
require('colors');

let command = 'npm install';

const askUser = (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question((<any>question).bold, (res: string) => {
      rl.close;
      resolve(res);
    });
  });
};
const wipeDeps = () => {
  const file = fs.readFileSync(join(__dirname, '..', 'package.json'));
  const content = JSON.parse(file.toString());
  const deps = Object.keys(content.dependencies);
  const devDeps = Object.keys(content.devDependencies);

  if (devDeps.length) {
    devDeps.forEach(v => (command += ` ${v}@latest`));
    command += ' -D';
  }
  if (devDeps.length && deps.length) command += ' && npm install';
  if (deps.length) deps.forEach(v => (command += ` ${v}@latest`));

  if (command.length < 12) return;
  child_process.spawn(command, {
    shell: true,
    cwd: __dirname,
    stdio: 'inherit'
  });
};

if (require.main == module)
  askUser(
    'Note: you are updating node modules to latest version\nWhich might effect your code stability! continue? [y/N]'
  ).then((res: string) => {
    if (['y', 'yes'].includes(res.toLowerCase())) wipeDeps();
    else {
      console.log('Abort!');
      process.exit(0);
    }
  });
else module.exports = wipeDeps;