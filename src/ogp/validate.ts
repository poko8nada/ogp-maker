import { type Err, err, type Ok, ok } from '../utils/types'

type Query = { slug?: string; title?: string }
type ValidQuery = { slug: string; title: string }
type ValidationResult =
  | Ok<ValidQuery>
  | Err<{ type: 'bad_request'; status: 400; message: string }>

export async function assertPostExists(
  bucket: R2Bucket,
  slug: string,
): Promise<boolean> {
  const bucketHead = await bucket.head(`posts/${slug}.md`)

  // If the head method returns null, it means the object does not exist in the bucket
  return bucketHead !== null
}

export function validateQuery(query: Query): ValidationResult {
  const slug = decodeURIComponent(query.slug ?? '')
  const title = decodeURIComponent(query.title ?? '')
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  if (slug.length === 0 || !slugRegex.test(slug)) {
    return err({
      type: 'bad_request',
      status: 400,
      message:
        'Invalid slug. Slug must be lowercase, alphanumeric, and can include hyphens.',
    })
  }

  if (title.length > 100) {
    return err({
      type: 'bad_request',
      status: 400,
      message:
        'Invalid title. Title must be a non-empty string with a maximum length of 100 characters.',
    })
  }

  return ok({ slug, title })
}
