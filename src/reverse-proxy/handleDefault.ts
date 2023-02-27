import type Http from "node:http"
import { socketData } from "../utils/socketData"
import type { Context } from "./Context"

export async function handleDefault(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<void> {
  const target = Object.values(ctx.targets)[0]

  const message = await socketData(request.socket)

  await target.send(message, (data) => {
    response.end(data)
  })
}
