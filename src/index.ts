import { Hono } from 'hono'
import { assertPostExists, validateQuery } from './ogp/validate'
import { isErr } from './utils/types'
import { renderOgpPng } from './ogp/render'
import { toErrorResponse } from './ogp/error'
import { getCachedImage, putCachedImage } from './ogp/cache'

const app = new Hono<{ Bindings: CloudflareBindings }>()


app.get('/ogp', async (c):Promise<Response> => {
  const query = c.req.query()
  const result = validateQuery(query)
  if (isErr(result)) {
    return toErrorResponse({ type: 'bad_request', message: result.error.message })
  }

  const isExists = await assertPostExists(c.env.POSTS_BUCKET, result.value.slug)
  if (!isExists) {
    return toErrorResponse({
      type: 'not_found',
      message: `Post with slug "${result.value.slug}" not found.`,
    })
  }

  try {
    const cache = caches.default
    const cacheKey = new Request(c.req.url, { method: 'GET' })
    const cachedImage = await getCachedImage(cache, cacheKey)
    if (cachedImage) {
      return cachedImage
    }

    const pngData = await renderOgpPng({
      title: result.value.title.length > 0 ? result.value.title : result.value.slug,
    })
    const response = new Response(pngData, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
    c.executionCtx.waitUntil(putCachedImage(cache, cacheKey, response))

    return response
  } catch (error) {
    console.error(error)
    return toErrorResponse({
      type: 'internal',
      message: 'Failed to render OGP image',
    })
  }

})

export default app
