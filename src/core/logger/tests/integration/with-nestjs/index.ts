import { testSuit } from './utilities'
import { testEstado } from './testA'
import { testE0 } from './testE0'
import { testE1 } from './testE1'
import { testE2 } from './testE2'
import { testE3_1 } from './testE3_1'
import { testE3_2 } from './testE3_2'
import { testE3_3 } from './testE3_3'
import { testE4 } from './testE4'
import { testE5 } from './testE5'
import { testE6 } from './testE6'
import { testE7 } from './testE7'
import { testE8_1 } from './testE8_1'
import { testE8_2 } from './testE8_2'
import { testE8_5 } from './testE8_5'
import { testE9 } from './testE9'
import { testE10 } from './testE10'

export default async function init() {
  testSuit([
    testEstado,
    testE0,
    testE1,
    testE2,
    testE3_1,
    testE3_2,
    testE3_3,
    testE4,
    testE5,
    testE6,
    testE7,
    testE8_1,
    testE8_2,
    testE8_5,
    testE9,
    testE10,
  ])
}

if (require.main === module) {
  init()
}
