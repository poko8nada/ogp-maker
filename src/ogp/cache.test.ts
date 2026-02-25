import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ok } from '../utils/types'

const {
  assertPostExistsMock,
  getCachedImageMock,
  putCachedImageMock,
  renderOgpPngMock,
  validateQueryMock,
} = vi.hoisted(() => ({
  assertPostExistsMock: vi.fn(),
  getCachedImageMock: vi.fn(),
  putCachedImageMock: vi.fn(),
  renderOgpPngMock: vi.fn(),
  validateQueryMock: vi.fn(),
}))

vi.mock('./validate', () => ({
  assertPostExists: assertPostExistsMock,
  validateQuery: validateQueryMock,
}))

vi.mock('./cache', () => ({
  getCachedImage: getCachedImageMock,
  putCachedImage: putCachedImageMock,
}))

vi.mock('./render', () => ({
  renderOgpPng: renderOgpPngMock,
}))

import app from '../index'

describe('cache flow on /ogp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('caches', { default: {} as Cache })
    validateQueryMock.mockReturnValue(ok({ slug: 'my-post', title: '' }))
    assertPostExistsMock.mockResolvedValue(true)
    putCachedImageMock.mockResolvedValue(undefined)
  })

  it('does not re-render when cache hits', async () => {
    const cachedPng = new Uint8Array([1, 2, 3])
    getCachedImageMock.mockResolvedValue(
      new Response(cachedPng, { headers: { 'Content-Type': 'image/png' } }),
    )

    const response = await app.request(
      'http://localhost/ogp?slug=my-post',
      {},
      { POSTS_BUCKET: {} as R2Bucket },
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/png')
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(cachedPng)
    expect(renderOgpPngMock).not.toHaveBeenCalled()
  })

  it('returns 500 when cache operation fails', async () => {
    getCachedImageMock.mockRejectedValue(new Error('cache unavailable'))

    const response = await app.request(
      'http://localhost/ogp?slug=my-post',
      {},
      { POSTS_BUCKET: {} as R2Bucket },
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      message: 'Failed to render OGP image',
    })
    expect(renderOgpPngMock).not.toHaveBeenCalled()
  })
})
