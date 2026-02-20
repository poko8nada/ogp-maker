import { Hono } from 'hono'
import { assertPostExists, validateQuery } from './ogp/validate'
import { isErr } from './utils/types'
import { renderOgpPng } from './ogp/render'

const app = new Hono<{ Bindings: CloudflareBindings }>()



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

  try {
    const pngData = await renderOgpPng({
      title: result.value.title.length > 0 ? result.value.title : result.value.slug,
    })

    return new Response(pngData, {
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Failed to render OGP image' }, 500)
  }

})

export default app
