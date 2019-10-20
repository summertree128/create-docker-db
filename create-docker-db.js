#! /usr/bin/env node

const inquirer = require('inquirer')
const commander = require('commander');

const program = new commander.Command();
program.version('0.0.1');
program.parse(process.argv);

// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza');

// program.parse(process.argv);

// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);

const createDatabase = async () => {
  const answer = await inquirer.prompt([
    {
      name: 'database',
      type: 'list',
      message: `Which database system you want to use?`,
      choices: ['postgresql']
    }
  ]).then(answers => console.log(answers.database))
}

const createVersion = async () => {
  const answer = await inquirer.prompt([
    {
      name: 'version',
      type: 'input',
      message: 'Which version you want to use?',
      default: 'latest'
    }
  ]).then(answers => console.log(answers.version))
}

const createYml = () => {
  const filename = 'docker-compose.yml'
  const version = ':latest'
  const ymlTemplate = `version: '3.1'

services:

  db:
    image: postgres${version}
    restart: always
    environment:
      POSTGRES_PASSWORD: password
`

  const fs = require('fs');
  fs.writeFile(filename, ymlTemplate, (err) => {
    if (err) {
      console.log(`Failed to create ${filename}`)
      console.log(err)
    }
  })
}

const create = async () => {
  await createDatabase()
  await createVersion()
  createYml()
}

create()
