import http from 'http'

export default async () => {
  await new Promise((resolve, reject) => {
    http
      .get('http://localhost:9999', (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
          data += chunk
        })
        resp.on('end', () => {
          resolve(JSON.parse(data).explanation)
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
