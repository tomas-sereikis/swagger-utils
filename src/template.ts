import * as assert from 'assert'
import { JoiCodeGenerator } from './generators/JoiCodeGenerator'
import {
  ISwaggerPathInfo,
  ISwaggerPaths,
  ISwaggerSchemeObject,
  ISwaggerSchemeObjectProperty,
  SwaggerParameterIn,
  SwaggerSchemeType,
} from './swagger'
import { TypeScriptCodeGenerator } from './generators/TypeScriptCodeGenerator'
import { camelCase, upperFirst, template } from 'lodash'
import { formatCode } from './prettier'

export interface ICreateTemplateParams {
  paths: ISwaggerPaths
  url: string
  method: string
  statusCode: string
  template: string
}

const removeNewLines = (str: string) => str.replace(/\r?\n|\r/g, ' ')

function parametersInToObjectScheme(
  parameters: ISwaggerPathInfo['parameters'],
  inType: SwaggerParameterIn,
): { count: number; required: string[]; scheme: ISwaggerSchemeObject } {
  const properties = parameters
    .filter(curr => curr.in === inType)
    .reduce(
      (previousValue, currentValue) => {
        if (
          currentValue.in === SwaggerParameterIn.body && 
          currentValue.name === 'body' && 
          currentValue.schema && 
          currentValue.schema.type === SwaggerSchemeType.object
        ) {
          return {
            ...previousValue,
            ...currentValue.schema.properties,
          }
        } else {
          return {
            ...previousValue,
            [currentValue.name]: currentValue.schema || currentValue,
          }
        }
      },
      {} as ISwaggerSchemeObjectProperty,
    )
  const required = parameters.filter(curr => curr.in === inType && curr.required).map(curr => curr.name)
  return {
    count: Object.keys(properties).length,
    required,
    scheme: {
      type: SwaggerSchemeType.object,
      properties,
      required,
    },
  }
}

function applyUrlParamsBuilder(url: string) {
  return (variable: string) => {
    const replaced = url.replace(/{(.*?)}/g, (match, value) => `\${${variable}.path.${value}}`)
    return `\`${replaced}\``
  }
}

export function createTemplate(options: ICreateTemplateParams): string {
  const tsCodeGenerator = new TypeScriptCodeGenerator()
  const joiCodeGenerator = new JoiCodeGenerator()

  const endpoint = options.paths[options.url][options.method]
  const response = endpoint ? endpoint.responses[options.statusCode] : null

  assert(!!endpoint, 'Swagger path info is not found!')
  assert(!!response, 'Swagger response is not found!')

  const bodyObjectScheme = parametersInToObjectScheme(endpoint.parameters, SwaggerParameterIn.body)
  const queryObjectScheme = parametersInToObjectScheme(endpoint.parameters, SwaggerParameterIn.query)
  const paramsObjectScheme = parametersInToObjectScheme(endpoint.parameters, SwaggerParameterIn.path)

  let optionsScheme = {}
  let required = []
  if (bodyObjectScheme.count) {
    optionsScheme = { ...optionsScheme, body: bodyObjectScheme.scheme }
    required.push(SwaggerParameterIn.body)
  }
  if (queryObjectScheme.count) {
    optionsScheme = { ...optionsScheme, query: queryObjectScheme.scheme }
  }
  if (queryObjectScheme.count && queryObjectScheme.required.length) {
    required.push(SwaggerParameterIn.query)
  }
  if (paramsObjectScheme.count) {
    optionsScheme = { ...optionsScheme, path: paramsObjectScheme.scheme }
    required.push(SwaggerParameterIn.path)
  }

  const optionsObject = tsCodeGenerator.onInterface(optionsScheme, required)
  const templateBuilder = template(options.template)
  const operationId = camelCase(endpoint.operationId)
  const description = endpoint.description ? removeNewLines(endpoint.description) : ''

  return formatCode(
    templateBuilder({
      applyUrlParams: applyUrlParamsBuilder(options.url),
      description: description,
      containsBody: ['post', 'put', 'patch'].includes(options.method),
      containsQuery: !!queryObjectScheme.count,
      responseInterface: tsCodeGenerator.of(response!.schema),
      optionsInterface: optionsObject,
      scheme: joiCodeGenerator.of(response!.schema),
      isDelete: ['delete'].includes(options.method),
      operationId,
      method: options.method,
      upperOperationId: upperFirst(operationId),
    }),
  )
}
