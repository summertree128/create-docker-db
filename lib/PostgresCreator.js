const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')

module.exports = class PostgresCreator {
  constructor (options) {
    this.baseDir = options.baseDir
  }

  async run () {
    const version = await this.promptVersion()
    await this.createYml(version)
    await this.createEntryPoint()
  }

  async promptVersion () {
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

  async createYml (version) {
    const ymlTemplate = `version: '3'
  
services:

  db:
    image: postgres:${version}
    ports:
      - 5432:5432
    restart: always
    environment:
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASS: password
      POSTGRES_DBNAME: postgres
    volumes:
      - ./docker-entrypoint-initdb.d/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./docker-entrypoint-initdb.d/data.sql:/docker-entrypoint-initdb.d/2-data.sql

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
`

    const dockerComposeYml = path.join(this.baseDir, 'docker-compose.yml')

    await fs.mkdirp(this.baseDir)
    fs.writeFile(path.join(dockerComposeYml), ymlTemplate, (err) => {
      if (err) {
        console.log(`Failed to create ${filename}`)
        console.log(err)
        process.exit(1)
      }
      console.log(`Created ${dockerComposeYml}`)
    })
  }

  async createEntryPoint () {
    const entryPointDir = path.join(this.baseDir, 'docker-entrypoint-initdb.d')
    await fs.mkdirp(entryPointDir)
    console.log(`Created ${entryPointDir}`)

    const schemaFile = path.join(entryPointDir, 'schema.sql')
    const schemaTemplate = `-- Define your schema here.
--
-- For example:
-- CREATE TABLE my_table (id SERIAL PRIMARY KEY, name text NOT NULL)
`
    fs.writeFile(schemaFile, schemaTemplate, (err) => {
      if (err) console.log(err)
    })
    console.log(`Created ${schemaFile}`)

    const dataFile = path.join(entryPointDir, 'data.sql')
    const dataTemplate = `-- Define your data here.
--
-- For example:
-- INSERT INTO my_table (name) VALUES (my_record)
`
    fs.writeFile(dataFile, dataTemplate, (err) => {
      if (err) console.log(err)
    })
    console.log(`Created ${dataFile}`)
  }
}


