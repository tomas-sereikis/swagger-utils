import * as swagger from '../src/swagger'
import mockOfCategories from './mocks/categories'
import mockOfChannels from './mocks/channel'
import mockOfPetstore from './mocks/petstore'

test('should test categories parsing paths', async () => {
  const data = await swagger.validate(mockOfCategories)
  expect(data).toMatchSnapshot()
})

test('should test channels parsing paths', async () => {
  const data = await swagger.validate(mockOfChannels)
  expect(data).toMatchSnapshot()
})

test('should test petstore parsing paths', async () => {
  const data = await swagger.validate(mockOfPetstore)
  expect(data).toMatchSnapshot()
})
