import * as prettier from 'prettier'
import { trim } from 'lodash'

const prettierrc = require('../.prettierrc.json')

export function formatCode(code: string): string {
  return trim(
    prettier.format(code, {
      parser: 'typescript',
      ...prettierrc,
    }),
    '\n',
  )
}
