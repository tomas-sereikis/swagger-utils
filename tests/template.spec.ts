import * as swagger from '../src/swagger'
import mockOfCategories from './mocks/categories'
import mockOfChannels from './mocks/channel'
import mockOfPetstore from './mocks/petstore'
import { createTemplate } from '../src/template'
import { promises as fs } from 'fs'

let templateContent: string | undefined

beforeEach(async () => {
  templateContent = String(await fs.readFile('tests/mocks/request.template'))
})

test('should create categories template', async () => {
  const docs = await swagger.validate(mockOfCategories)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/channel-categories',
    method: 'get',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})

test('should create petstore pets template', async () => {
  const docs = await swagger.validate(mockOfPetstore)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/pets',
    method: 'get',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})

test('should create petstore pets(post) template', async () => {
  const docs = await swagger.validate(mockOfPetstore)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/pets',
    method: 'post',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})

test('should create petstore pet template', async () => {
  const docs = await swagger.validate(mockOfPetstore)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/pets/{id}',
    method: 'get',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})

test('should create channel template', async () => {
  const docs = await swagger.validate(mockOfChannels)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/channels',
    method: 'get',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})

test('should create channel(post) template', async () => {
  const docs = await swagger.validate(mockOfChannels)
  const template = await createTemplate({
    template: templateContent!,
    paths: docs.paths,
    url: '/channels',
    method: 'post',
    statusCode: '200',
  })
  expect(template).toMatchSnapshot()
})
