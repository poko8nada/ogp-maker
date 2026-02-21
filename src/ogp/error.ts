export type OgpError = {
  type: 'bad_request' | 'not_found' | 'internal'
  message: string
}

export function toErrorResponse(error: OgpError): Response {
  const status = error.type === 'bad_request' ? 400 : error.type === 'not_found' ? 404 : 500
  return Response.json({ message: error.message }, { status })
}
