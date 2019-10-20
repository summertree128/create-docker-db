#! /usr/bin/env node

const inquirer = require('inquirer')
const commander = require('commander');

const program = new commander.Command();
program.version('0.0.1');
program.parse(process.argv);

const createDatabase = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'database',
      type: 'list',
      message: `Which database system you want to use?`,
      choices: ['postgresql']
    }
  ])
  return answers.database
}

const createVersion = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'version',
      type: 'input',
      message: 'Which version you want to use?',
      default: 'latest'
    }
  ])
  return answers.version
}

const createYml = (version) => {
  const filename = 'docker-compose.yml'
  const ymlTemplate = `version: '3.1'

services:

  db:
    image: postgres:${version}
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
  const database = await createDatabase()
  const version = await createVersion()
  console.log(database)
  console.log(version)

  createYml(version)
}

create()
