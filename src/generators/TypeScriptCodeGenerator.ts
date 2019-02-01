import { CodeGenerator } from './CodeGenerator'
import {
  ISwaggerScheme,
  ISwaggerSchemeArray,
  ISwaggerSchemeBoolean,
  ISwaggerSchemeNumber,
  ISwaggerSchemeObject,
  ISwaggerSchemeString,
  SwaggerSchemeType,
  joinSwaggerSchemeObjectOfAll,
} from '../swagger'
import { formatCode } from '../prettier'

interface IOfInterfaceObject {
  [key: string]: ISwaggerScheme
}

export class TypeScriptCodeGenerator implements CodeGenerator {
  private static formatCodeLocal(code: string): string {
    return formatCode(`type A = ${code}`).substr(9)
  }

  of(scheme: ISwaggerScheme): string {
    const type = scheme.type
    switch (scheme.type) {
      case SwaggerSchemeType.array:
        return this.ofArray(scheme)
      case SwaggerSchemeType.boolean:
        return this.ofBoolean(scheme)
      case SwaggerSchemeType.number:
      case SwaggerSchemeType.integer:
        return this.ofNumber(scheme)
      case SwaggerSchemeType.object:
        return this.ofObject(scheme)
      case SwaggerSchemeType.string:
        return this.ofString(scheme)
      default:
        throw new Error(`Not implemented typeOf ${type}!`)
    }
  }

  ofArray(scheme: ISwaggerSchemeArray): string {
    const arrayItemsValue = this.of(scheme.items)
    const defaultValue = `Array<${arrayItemsValue}>`
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }

  ofBoolean(scheme: ISwaggerSchemeBoolean): string {
    const defaultValue = 'boolean'
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }

  ofNumber(scheme: ISwaggerSchemeNumber): string {
    const defaultValue = 'number'
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }

  ofObject(scheme: ISwaggerSchemeObject): string {
    const info = joinSwaggerSchemeObjectOfAll(scheme)
    const keyValues = Object.keys(info.properties).reduce((previousValue, currentValue) => {
      const suffix = info.required.includes(currentValue) ? '' : '?'
      const scheme = this.of(info.properties[currentValue])
      return `${previousValue}'${currentValue}'${suffix}:${scheme},\n`
    }, '')
    const defaultValue = `{\n${keyValues}}`
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }

  ofString(scheme: ISwaggerSchemeString): string {
    const defaultValue = scheme.enum ? scheme.enum.map(val => `'${val}'`).join(' | ') : 'string'
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }

  onInterface(object: IOfInterfaceObject, required: string[]): string {
    const keyValues = Object.keys(object).reduce((previousValue, currentValue) => {
      const suffix = required.includes(currentValue) ? '' : '?'
      const scheme = this.of(object[currentValue])
      return `${previousValue}'${currentValue}'${suffix}:${scheme},\n`
    }, '')
    const defaultValue = `{\n${keyValues}}`
    return TypeScriptCodeGenerator.formatCodeLocal(defaultValue)
  }
}
