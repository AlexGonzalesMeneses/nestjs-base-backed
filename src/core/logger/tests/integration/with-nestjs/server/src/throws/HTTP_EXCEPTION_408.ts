export default async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 999999999)
  })
}
