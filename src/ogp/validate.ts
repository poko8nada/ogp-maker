import { type Ok, type Err, ok, err } from "../utils/types";

type ValidQuery = { slug: string; title: string }
type ValidationResult = Ok<ValidQuery> | Err<{ status: 400; message: string }>

export async function assertPostExists(bucket: R2Bucket, slug: string): Promise<boolean>{
  const bucketHead = await bucket.head(slug);
  if (bucketHead === null) {
    return false;
  }
  return true;
}

export function validateQuery(query: URLSearchParams): ValidationResult {
  const slug = query.get("slug")?.trim() || null;
  const title = query.get("title")?.trim() || null;

  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (slug === null || regex.test(slug) === false){
    return err({
      status: 400,
      message: "Invalid slug. Slug must be lowercase, alphanumeric, and can include hyphens.",
    });
  }
  if (title === null || title.length > 100) {
    return err({
      status: 400,
      message: "Invalid title. Title must be a non-empty string with a maximum length of 100 characters.",
    });
  }

  return ok({ slug, title });
}
