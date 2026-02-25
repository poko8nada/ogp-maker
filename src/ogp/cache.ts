export async function getCachedImage(
  cache: Cache,
  request: Request,
): Promise<Response | undefined> {
  const cached = await cache.match(request)
  return cached ?? undefined
}

export async function putCachedImage(
  cache: Cache,
  request: Request,
  response: Response,
): Promise<void> {
  await cache.put(request, response.clone())
}
