import Http from "node:http"
import { requestBytes } from "./requestBytes"

export async function requestText(
  request: Http.IncomingMessage,
): Promise<string> {
  const buffer = await requestBytes(request)
  return buffer.toString()
}
