import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const targetUrl = new URL(
    getRequestURL(event).pathname + getRequestURL(event).search,
    config.apiProxyTarget,
  )

  const token = await getToken({ event })

  if (token?.accessToken) {
    event.node.req.headers['authorization'] = `Bearer ${token.accessToken}`
  }

  return proxyRequest(event, targetUrl.toString())
})
