import { describe, expect, it, vi } from 'vitest'
import { isErr, isOk } from '../utils/types'
import { assertPostExists, validateQuery } from './validate'

describe('validateQuery', () => {
  it('returns ok for valid slug and optional title', () => {
    const result = validateQuery({ slug: 'my-post-slug' })

    expect(isOk(result)).toBe(true)
    if (isOk(result)) {
      expect(result.value).toEqual({ slug: 'my-post-slug', title: '' })
    }
  })

  it('returns error when slug is missing', () => {
    const result = validateQuery({ title: 'hello' })

    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.error.status).toBe(400)
    }
  })

  it('returns error when slug format is invalid', () => {
    const result = validateQuery({ slug: 'Invalid Slug' })

    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.error.status).toBe(400)
    }
  })

  it('returns error when title exceeds max length', () => {
    const result = validateQuery({ slug: 'my-post', title: 'a'.repeat(101) })

    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.error.status).toBe(400)
    }
  })
})

describe('assertPostExists', () => {
  const createBucket = (headValue: object | null): R2Bucket =>
    ({
      head: vi.fn().mockResolvedValue(headValue),
    }) as unknown as R2Bucket

  it('returns true when bucket head finds a post', async () => {
    const bucket = createBucket({})

    const result = await assertPostExists(bucket, 'my-post')

    expect(result).toBe(true)
    expect(bucket.head).toHaveBeenCalledWith('posts/my-post.md')
  })

  it('returns false when bucket head returns null', async () => {
    const bucket = createBucket(null)

    const result = await assertPostExists(bucket, 'missing-post')

    expect(result).toBe(false)
    expect(bucket.head).toHaveBeenCalledWith('posts/missing-post.md')
  })
})
