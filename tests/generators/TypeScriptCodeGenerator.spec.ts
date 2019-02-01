import * as swagger from '../../src/swagger'
import mockOfCategories from '../mocks/categories'
import mockOfPetstore from '../mocks/petstore'
import { SwaggerSchemeType } from '../../src/swagger'
import { TypeScriptCodeGenerator } from '../../src/generators/TypeScriptCodeGenerator'

describe('initial methods', () => {
  const tsCodeGenerator = new TypeScriptCodeGenerator()

  describe('array builder', () => {
    test('should build array of boolean', () => {
      const value1 = tsCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.boolean },
      })
      const value2 = tsCodeGenerator.of({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.boolean },
      })
      expect(value1).toBe(`Array<boolean>`)
      expect(value2).toBe(value2)
    })

    test('should build array of string', () => {
      const value1 = tsCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.string },
      })
      const value2 = tsCodeGenerator.of({ type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.string } })
      expect(value1).toBe(`Array<string>`)
      expect(value2).toBe(value2)
    })

    test('should build array of array of boolean', () => {
      const value1 = tsCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.boolean } },
      })
      const value2 = tsCodeGenerator.of({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.boolean } },
      })
      expect(value1).toBe(`Array<Array<boolean>>`)
      expect(value2).toBe(value2)
    })
  })

  describe('boolean builder', () => {
    test('should build boolean', () => {
      const value1 = tsCodeGenerator.ofBoolean({ type: SwaggerSchemeType.boolean })
      const value2 = tsCodeGenerator.of({ type: SwaggerSchemeType.boolean })
      expect(value1).toBe(`boolean`)
      expect(value1).toBe(value2)
    })
  })

  describe('number builder', () => {
    test('should build number', () => {
      const value1 = tsCodeGenerator.ofNumber({ type: SwaggerSchemeType.number })
      const value2 = tsCodeGenerator.of({ type: SwaggerSchemeType.number })
      expect(value1).toBe(`number`)
      expect(value1).toBe(value2)
    })
  })

  describe('object builder', () => {
    test('should build object with two keys number and boolean', () => {
      const value1 = tsCodeGenerator.ofObject({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.number },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: ['a'],
      })
      const value2 = tsCodeGenerator.of({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.number },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: ['a'],
      })
      expect(value1).toBe(`{\n  a: number\n  b?: boolean\n}`)
      expect(value1).toBe(value2)
    })

    test('should build object with two keys array and boolean', () => {
      const value1 = tsCodeGenerator.ofObject({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.number } },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: [],
      })
      const value2 = tsCodeGenerator.of({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.number } },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: [],
      })
      expect(value1).toBe(`{\n  a?: Array<number>\n  b?: boolean\n}`)
      expect(value1).toBe(value2)
    })
  })

  describe('string builder', () => {
    test('should build string with allow empty value', () => {
      const value1 = tsCodeGenerator.ofString({ type: SwaggerSchemeType.string })
      const value2 = tsCodeGenerator.of({ type: SwaggerSchemeType.string })
      expect(value1).toBe(`string`)
      expect(value1).toBe(value2)
    })
    test('should build string enum', () => {
      const value1 = tsCodeGenerator.ofString({ type: SwaggerSchemeType.string, enum: ['a', 'b'] })
      const value2 = tsCodeGenerator.of({ type: SwaggerSchemeType.string, enum: ['a', 'b'] })
      expect(value1).toBe(`'a' | 'b'`)
      expect(value1).toBe(value2)
    })
  })
})

describe('mock tests', () => {
  const tsCodeGenerator = new TypeScriptCodeGenerator()

  test('should create categories validation', async () => {
    const docs = await swagger.validate(mockOfCategories)
    const schemeObject = docs.paths['/channel-categories'].get.responses['200'].schema
    const value = tsCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })

  test('should create petstore pets get validation', async () => {
    const docs = await swagger.validate(mockOfPetstore)
    const schemeObject = docs.paths['/pets'].get.responses['200'].schema
    const value = tsCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })

  test('should create petstore pet get validation', async () => {
    const docs = await swagger.validate(mockOfPetstore)
    const schemeObject = docs.paths['/pets/{id}'].get.responses['200'].schema
    const value = tsCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })
})
