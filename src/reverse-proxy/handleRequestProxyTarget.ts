import type Http from "node:http"
import type { Json } from "../utils/Json"
import type { Context } from "./Context"

export async function handleRequestProxyTarget(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  if (request.method === "POST") {
    // TODO
  }

  throw new Error(
    [
      `[handleRequestProxyTarget] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
