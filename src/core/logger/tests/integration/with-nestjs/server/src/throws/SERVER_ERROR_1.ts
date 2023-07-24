export default async () => {
  // eslint-disable-next-line no-throw-literal
  throw {
    response: {
      data: {
        message: 'detalle del error',
      },
    },
  }
}
