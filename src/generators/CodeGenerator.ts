import {
  ISwaggerScheme,
  ISwaggerSchemeArray,
  ISwaggerSchemeBoolean,
  ISwaggerSchemeNumber,
  ISwaggerSchemeObject,
  ISwaggerSchemeString,
} from '../swagger'

export interface CodeGenerator {
  of(scheme: ISwaggerScheme): string
  ofArray(scheme: ISwaggerSchemeArray): string
  ofBoolean(scheme: ISwaggerSchemeBoolean): string
  ofNumber(scheme: ISwaggerSchemeNumber): string
  ofObject(scheme: ISwaggerSchemeObject): string
  ofString(scheme: ISwaggerSchemeString): string
}
