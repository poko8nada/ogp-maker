import { Hono } from 'hono'
import { assertPostExists, validateQuery } from './ogp/validate'
import { isErr } from './utils/types'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

app.get('/ogp', async (c) => {
  const query = c.req.query()
  const result = validateQuery(query)
  if (isErr(result)) {
    return c.json({ message: result.error.message }, 400)
  }

  const isExists = await assertPostExists(c.env.POSTS_BUCKET, result.value.slug)
  if (!isExists) {
    return c.json({ message: 'Post not found' }, 404)
  }

  return c.json({ message: 'OGP endpoint', query: result.value })

})

export default app
