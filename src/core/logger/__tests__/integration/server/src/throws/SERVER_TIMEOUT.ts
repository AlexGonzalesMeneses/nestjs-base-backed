export default async () => {
  // eslint-disable-next-line no-throw-literal
  throw {
    response: {
      data: 'The upstream server is timing out',
    },
  }
}
