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
    const ymlTemplate = `version: '3.1'
  
  services:
  
    db:
      image: postgres:${version}
      restart: always
      environment:
        POSTGRES_PASSWORD: password
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
  }
}


