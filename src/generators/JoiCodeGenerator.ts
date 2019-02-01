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

export class JoiCodeGenerator implements CodeGenerator {
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
    const defaultValue = `joi.array().items(${arrayItemsValue})`
    return formatCode(defaultValue)
  }

  ofBoolean(scheme: ISwaggerSchemeBoolean): string {
    const defaultValue = 'joi.boolean()'
    return formatCode(defaultValue)
  }

  ofNumber(scheme: ISwaggerSchemeNumber): string {
    const defaultValue = 'joi.number()'
    return formatCode(defaultValue)
  }

  ofObject(scheme: ISwaggerSchemeObject): string {
    const info = joinSwaggerSchemeObjectOfAll(scheme)
    const keyValues = Object.keys(info.properties).reduce((previousValue, currentValue) => {
      const required = info.required.includes(currentValue) ? '.required()' : ''
      const nextScheme = this.of(info.properties[currentValue])
      return `${previousValue}'${currentValue}':${nextScheme}${required},\n`
    }, '')
    const defaultValue = `joi.object().keys({\n${keyValues}})`
    return formatCode(defaultValue)
  }

  ofString(scheme: ISwaggerSchemeString): string {
    const defaultValue =
      scheme.enum && scheme.enum.length
        ? `joi.string().valid(${JSON.stringify(scheme.enum)})`
        : `joi.string().allow('')`
    return formatCode(defaultValue)
  }
}
