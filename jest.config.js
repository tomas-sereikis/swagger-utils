module.exports = {
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.spec.(ts|js)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
}
