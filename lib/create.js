const inquirer = require('inquirer')

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

const createYml = async (version) => {
  const ymlTemplate = `version: '3.1'

services:

  db:
    image: postgres:${version}
    restart: always
    environment:
      POSTGRES_PASSWORD: password
`

  const fs = require('fs-extra')
  const path = require('path')

  const dockerDir = path.join(process.cwd(), 'docker-db')
  const entryPointDir = path.join(dockerDir, 'docker-entrypoint-initdb.d')
  const dockerComposeYml = 'docker-compose.yml'

  await fs.mkdirp(entryPointDir)
  fs.writeFile(path.join(dockerDir, dockerComposeYml), ymlTemplate, (err) => {
    if (err) {
      console.log(`Failed to create ${filename}`)
      console.log(err)
    }
  })
}

async function create () {
  const database = await createDatabase()
  const version = await createVersion()
  console.log(database)
  console.log(version)

  await createYml(version)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.log(err)
    process.exit(1)
  })
}