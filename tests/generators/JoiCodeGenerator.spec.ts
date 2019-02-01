import * as swagger from '../../src/swagger'
import mockOfCategories from '../mocks/categories'
import mockOfPetstore from '../mocks/petstore'
import { JoiCodeGenerator } from '../../src/generators/JoiCodeGenerator'
import { SwaggerSchemeType } from '../../src/swagger'

describe('initial methods', () => {
  const joiCodeGenerator = new JoiCodeGenerator()

  describe('array builder', () => {
    test('should build array of boolean', () => {
      const value1 = joiCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.boolean },
      })
      const value2 = joiCodeGenerator.of({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.boolean },
      })
      expect(value1).toBe(`joi.array().items(joi.boolean())`)
      expect(value2).toBe(value2)
    })

    test('should build array of number', () => {
      const value1 = joiCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.number },
      })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.number } })
      expect(value1).toBe(`joi.array().items(joi.number())`)
      expect(value2).toBe(value2)
    })

    test('should build array of string', () => {
      const value1 = joiCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.string },
      })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.string } })
      expect(value1).toBe(`joi.array().items(joi.string().allow(''))`)
      expect(value2).toBe(value2)
    })

    test('should build array of array of boolean', () => {
      const value1 = joiCodeGenerator.ofArray({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.boolean } },
      })
      const value2 = joiCodeGenerator.of({
        type: SwaggerSchemeType.array,
        items: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.boolean } },
      })
      expect(value1).toBe(`joi.array().items(joi.array().items(joi.boolean()))`)
      expect(value2).toBe(value2)
    })
  })

  describe('boolean builder', () => {
    test('should build boolean optional', () => {
      const value1 = joiCodeGenerator.ofBoolean({ type: SwaggerSchemeType.boolean })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.boolean })
      expect(value1).toBe(`joi.boolean()`)
      expect(value1).toBe(value2)
    })
  })

  describe('number builder', () => {
    test('should build number', () => {
      const value1 = joiCodeGenerator.ofNumber({ type: SwaggerSchemeType.number })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.number })
      expect(value1).toBe(`joi.number()`)
      expect(value1).toBe(value2)
    })
  })

  describe('object builder', () => {
    test('should build object with two keys number and boolean', () => {
      const value1 = joiCodeGenerator.ofObject({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.number },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: ['a'],
      })
      const value2 = joiCodeGenerator.of({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.number },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: ['a'],
      })
      expect(value1).toBe(`joi.object().keys({\n  a: joi.number().required(),\n  b: joi.boolean(),\n})`)
      expect(value1).toBe(value2)
    })

    test('should build object with two keys array and boolean', () => {
      const value1 = joiCodeGenerator.ofObject({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.number } },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: [],
      })
      const value2 = joiCodeGenerator.of({
        type: SwaggerSchemeType.object,
        properties: {
          a: { type: SwaggerSchemeType.array, items: { type: SwaggerSchemeType.number } },
          b: { type: SwaggerSchemeType.boolean },
        },
        required: [],
      })
      expect(value1).toBe(`joi.object().keys({\n  a: joi.array().items(joi.number()),\n  b: joi.boolean(),\n})`)
      expect(value1).toBe(value2)
    })
  })

  describe('string builder', () => {
    test('should build string with allow empty value', () => {
      const value1 = joiCodeGenerator.ofString({ type: SwaggerSchemeType.string })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.string })
      expect(value1).toBe(`joi.string().allow('')`)
      expect(value1).toBe(value2)
    })
    test('should build string enum optional', () => {
      const value1 = joiCodeGenerator.ofString({ type: SwaggerSchemeType.string, enum: ['a', 'b'] })
      const value2 = joiCodeGenerator.of({ type: SwaggerSchemeType.string, enum: ['a', 'b'] })
      expect(value1).toBe(`joi.string().valid(['a', 'b'])`)
      expect(value1).toBe(value2)
    })
  })
})

describe('mock tests', () => {
  const joiCodeGenerator = new JoiCodeGenerator()

  test('should create categories validation', async () => {
    const docs = await swagger.validate(mockOfCategories)
    const schemeObject = docs.paths['/channel-categories'].get.responses['200'].schema
    const value = joiCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })

  test('should create petstore pets get validation', async () => {
    const docs = await swagger.validate(mockOfPetstore)
    const schemeObject = docs.paths['/pets'].get.responses['200'].schema
    const value = joiCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })

  test('should create petstore pet get validation', async () => {
    const docs = await swagger.validate(mockOfPetstore)
    const schemeObject = docs.paths['/pets/{id}'].get.responses['200'].schema
    const value = joiCodeGenerator.of(schemeObject)
    expect(value).toMatchSnapshot()
  })
})
