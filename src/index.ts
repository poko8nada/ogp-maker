import { Hono } from 'hono'
import { assertPostExists } from './ogp/validate'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

app.get('/ogp', async (c) => {
  const query = c.req.query()
  const BUCKET = c.env.POSTS_BUCKET

  const isExists = await assertPostExists(BUCKET, query.slug)
  if (!isExists) {
    return c.json({ message: 'Post not found' }, 404)
  }


  return c.json({ message: 'OGP endpoint', query })

})

export default app
