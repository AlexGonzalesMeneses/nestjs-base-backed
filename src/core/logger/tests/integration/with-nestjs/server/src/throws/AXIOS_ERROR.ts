import axios from 'axios'

export default async () => {
  await axios('http://localhost:3333/api/not-found')
}
