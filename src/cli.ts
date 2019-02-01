import * as assert from 'assert'
import * as prompts from 'prompts'
import * as path from 'path'
import * as swagger from './swagger'
import { promises as fs } from 'fs'
import { createTemplate } from './template'

const MSG_OVERWRITE_FILE = 'Would you like to overwrite {fileName}'
const MSG_ENTER_TEMPLATE_PATH = 'Enter template path'
const MSG_ENTER_OUTPUT_PATH = 'Enter output path'
const MSG_ENTER_SWAGGER_JSON_URL = 'Enter swagger.json file url'
const MSG_SELECT_PATHS = 'Select paths that you would like to use'
const MSG_SELECT_OPERATIONS = 'Select operations that you would like to use'
const MSG_SELECT_STATUS_CODE = 'Select statusCode for {operationId}'

main(process.argv.slice(2)).catch(console.error)

async function main(argv: ReadonlyArray<string>) {
  const { value: templatePath } = await prompts({
    message: MSG_ENTER_TEMPLATE_PATH,
    name: 'value',
    type: 'text',
  })

  const templateStat = await fs.stat(templatePath)
  assert(templateStat.isFile(), 'Template file dose not exist!')
  const templateContent = String(await fs.readFile(templatePath))

  const { value: outputPath } = await prompts({
    message: MSG_ENTER_OUTPUT_PATH,
    name: 'value',
    type: 'text',
  })

  const outputStat = await fs.stat(outputPath)
  assert(outputStat.isDirectory(), 'Output directory dose not exist!')

  const { value: swaggerUrl } = await prompts({
    message: MSG_ENTER_SWAGGER_JSON_URL,
    name: 'value',
    type: 'text',
  })

  const docs = await swagger.validate(swaggerUrl)
  const choicesOfPaths = Object.keys(docs.paths).map(path => ({ value: path, title: path }))
  const { value: paths } = await prompts({
    message: MSG_SELECT_PATHS,
    name: 'value',
    type: 'multiselect',
    choices: choicesOfPaths,
  })

  const choicesOfOperations = Object.keys(docs.paths)
    .filter(path => paths.includes(path))
    .map(path => Object.values(docs.paths[path]))
    .reduce(
      (previousValue, currentValue) => [...previousValue, ...currentValue.map(curr => curr.operationId)],
      [] as string[],
    )
    .map(operation => ({ value: operation, title: operation }))

  const { value: operations } = await prompts({
    message: MSG_SELECT_OPERATIONS,
    name: 'value',
    type: 'multiselect',
    choices: choicesOfOperations,
  })

  for (const url of Object.keys(docs.paths)) {
    for (const method of Object.keys(docs.paths[url])) {
      const info = docs.paths[url][method]
      if (!operations.includes(info.operationId)) {
        continue
      }
      const statusCodes = Object.keys(info.responses)
      let statusCode: string | undefined
      if (statusCodes.length === 0) {
        continue
      } else if (statusCodes.length === 1) {
        statusCode = statusCodes[0]
      } else {
        const choicesOfStatusCodes = statusCodes.map(code => ({ value: code, title: code }))
        const selection = await prompts({
          message: MSG_SELECT_STATUS_CODE.replace('{operationId}', info.operationId),
          name: 'value',
          type: 'select',
          choices: choicesOfStatusCodes,
        })
        statusCode = selection.value
      }
      const template = await createTemplate({
        template: templateContent,
        paths: docs.paths,
        url,
        method,
        statusCode: statusCode!,
      })
      const filePath = path.resolve(outputPath, `${info.operationId}.ts`)
      const filePathStat = await fs.stat(filePath).catch(() => null)
      if (filePathStat && filePathStat.isFile()) {
        const { value: overwrite } = await prompts({
          message: MSG_OVERWRITE_FILE.replace('{filePath}', filePath),
          name: 'value',
          type: 'toggle',
          initial: true,
          active: 'yes',
          inactive: 'no',
        })
        if (overwrite === 'no') {
          continue
        }
      }
      await fs.writeFile(filePath, template)
    }
  }
}
