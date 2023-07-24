import { cmd, delay } from '../funciones-comun'

export default async function testSuit() {
  await eliminarFicherosLog()

  await cmd(`ts-node demo/script.ts`, __dirname)
}

async function eliminarFicherosLog() {
  await cmd('rm -rf demo/logs/demo/*.log', __dirname)
  await delay()
}

if (require.main === module) {
  testSuit()
}
