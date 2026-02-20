import { err, ok, type Err, type Ok } from '../utils/types'

export async function getFont(cache: Cache, fontName: string): Promise<Ok<ArrayBuffer> | Err<string>> {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400`
  const cacheKey = new Request(fontUrl)

  const cachedResponse = await cache.match(cacheKey)
  if (cachedResponse) {
    return ok(await cachedResponse.clone().arrayBuffer())
  }

  const response = await fetch(fontUrl, {
    headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  })

  if (!response.ok) {
    return err(`Failed to fetch font CSS: ${response.statusText}`)
  }

  const css = await response.text()
  const fontFileUrl = css.match(
    /src: url\(([^)]+)\) format\('(woff2|woff|opentype|truetype)'\)/
  )?.[1]

  if (!fontFileUrl) return err('Failed to parse font URL from CSS')

  const fontFileResponse = await fetch(fontFileUrl)
  if (!fontFileResponse.ok) {
    return err(`Failed to fetch font file: ${fontFileResponse.statusText}`)
  }

  const fontData = await fontFileResponse.arrayBuffer()
  await cache.put(cacheKey, new Response(fontData, { headers: { 'Content-Type': 'font/woff2' } }))

  return ok(fontData)
}
