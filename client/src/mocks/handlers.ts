import { rest } from 'msw'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const handlers = [
  rest.get('/rooms/:roomId', (req, res, ctx) => {
    const roomId = req.params['roomId']
    const response = loadResponse(`./rooms/get/${roomId}.json`)
    return res(ctx.json(response))
  }),

  rest.get('/messages/:roomId', (req, res, ctx) => {
    const roomId = req.params['roomId']
    const response = loadResponse(`./messages/get/${roomId}.json`)
    return res(ctx.json(response))
  }),

  rest.get('users/:userId', (req, res, ctx) => {
    const userId = req.params['userId']
    const response = loadResponse(`./users/get/${userId}.json`)
    return res(ctx.json(response))
  }),
]

const loadResponse = (relativePath: string): JSON => {
  const path = resolve(__dirname, relativePath)
  const contents = readFileSync(path, { encoding: 'utf-8' })
  return JSON.parse(contents)
}
