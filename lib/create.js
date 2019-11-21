const inquirer = require('inquirer')
const path = require('path')
const PostgresCreator = require('./postgresCreator')

const promptDatabase = async () => {
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

async function create () {
  const database = await promptDatabase()
  if (database !== 'postgresql') {
    console.log('only postgresql is supported for now. exit.')
    process.exit(1)
  }

  // to be factory
  const baseDir = path.join(process.cwd(), 'postgres')
  const options = {baseDir}

  const creator = new PostgresCreator(options)
  creator.run()
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.log(err)
    process.exit(1)
  })
}