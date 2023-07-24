export default async function init() {
  // await (await import('./with-scripts')).default()
  await (await import('./with-nestjs')).default()

  process.stdout.write('\n Prueba concluida correctamente :)\n\n')
}

if (require.main === module) {
  init()
}
