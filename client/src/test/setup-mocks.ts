import { server } from '../mocks/server'

beforeAll(() => server.listen())

afterAll(() => server.close())

afterEach(() => server.resetHandlers())
