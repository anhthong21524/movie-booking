export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const targetUrl = new URL(getRequestURL(event).pathname + getRequestURL(event).search, config.apiProxyTarget)

  return proxyRequest(event, targetUrl.toString())
})
