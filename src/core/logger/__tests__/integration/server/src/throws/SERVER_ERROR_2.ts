export default async () => {
  // eslint-disable-next-line no-throw-literal
  throw {
    response: {
      data: {
        data: 'detalle del error',
      },
    },
  }
}
