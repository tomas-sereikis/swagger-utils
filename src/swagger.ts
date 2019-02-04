import * as swaggerParser from 'swagger-parser'
import * as swaggerScheme from 'swagger-schema-official'
import { assign, flatten } from 'lodash'

export async function validate(docs: swaggerScheme.Spec): Promise<ISwaggerDocs> {
  return await swaggerParser.validate(docs)
}

export function swaggerSchemeObjectPropertiesMerge(object: ISwaggerSchemeObject): ISwaggerSchemeObjectProperties {
  const type = SwaggerSchemeType.object
  if (object.allOf) {
    const required = flatten(object.allOf.map(curr => curr.required))
    const properties = assign({} as ISwaggerSchemeObjectProperty, ...object.allOf.map(curr => curr.properties))
    return { properties, required, type }
  } else if (object.properties && object.required) {
    return { properties: object.properties, required: object.required, type }
  } else {
    return { properties: {}, required: [], type }
  }
}

export enum SwaggerSchemeType {
  object = 'object',
  boolean = 'boolean',
  array = 'array',
  string = 'string',
  number = 'number',
  integer = 'integer',
  interface = 'interface',
}

export enum SwaggerParameterIn {
  query = 'query',
  path = 'path',
  body = 'body',
}

export interface ISwaggerDocs {
  info: ISwaggerDocsInfo
  paths: ISwaggerPaths
}

export interface ISwaggerDocsInfo {
  title: string
  description?: string
}

export interface ISwaggerPaths {
  [url: string]: ISwaggerPath
}

export interface ISwaggerPath {
  [method: string]: ISwaggerPathInfo
}

export interface ISwaggerPathInfo {
  description?: string
  summary: string
  operationId: string
  parameters?: Array<ISwaggerParameterDefaults & ISwaggerSchemeObject>
  tags: string[]
  responses: ISwaggerPathResponses
}

export interface ISwaggerParameterDefaults {
  name: string
  in: SwaggerParameterIn
  schema?: ISwaggerScheme
}

export interface ISwaggerPathResponses {
  [statusCode: string]: ISwaggerPathResponse
}

export interface ISwaggerPathResponse {
  schema: ISwaggerScheme
  description: string
}

export interface ISwaggerSchemeObjectProperty {
  [key: string]: ISwaggerScheme
}

export interface ISwaggerSchemeObjectProperties {
  properties: ISwaggerSchemeObjectProperty
  required: string[]
  type: SwaggerSchemeType.object
}

export interface ISwaggerSchemeObject extends Partial<ISwaggerSchemeObjectProperties> {
  type: SwaggerSchemeType.object
  allOf?: ISwaggerSchemeObjectProperties[]
}

export interface ISwaggerSchemeBoolean {
  type: SwaggerSchemeType.boolean
}

export interface ISwaggerSchemeArray {
  type: SwaggerSchemeType.array
  items: ISwaggerScheme
}

export interface ISwaggerSchemeString {
  type: SwaggerSchemeType.string
  enum?: string[]
}

export interface ISwaggerSchemeNumber {
  type: SwaggerSchemeType.number | SwaggerSchemeType.integer
}

export type ISwaggerScheme =
  | ISwaggerSchemeObject
  | ISwaggerSchemeBoolean
  | ISwaggerSchemeArray
  | ISwaggerSchemeString
  | ISwaggerSchemeNumber
