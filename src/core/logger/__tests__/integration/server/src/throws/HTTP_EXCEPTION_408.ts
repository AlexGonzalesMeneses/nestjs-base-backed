export default async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 3000)
  })
}
