import Http from "node:http"
import qs from "qs"
import { requestURL } from "./requestURL.js"

export function requestQuery(
  request: Http.IncomingMessage,
): Record<string, any> {
  const url = requestURL(request)
  return qs.parse(url.search.slice(1), { allowDots: true })
}
