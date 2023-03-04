import { ty } from "@xieyuheng/ty"
import type Http from "node:http"
import Net from "node:net"
import { requestToken } from "../database-server/requestToken"
import * as Db from "../db"
import { Unauthorized } from "../errors/Unauthorized"
import { requestJsonObject } from "../server/requestJsonObject"
import { serverListen } from "../server/serverListen"
import { tokenAssert } from "../token"
import type { Json } from "../utils/Json"
import { findPort } from "../utils/node/findPort"
import type { Context } from "./Context"
import { keySize, ReverseProxyTarget } from "./ReverseProxyTarget"
import { SubdomainSchema } from "./SubdomainSchema"

export async function handleReverseProxyTarget(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  const who = "handleReverseProxyTarget"

  const token = await requestToken(ctx, request)

  if (request.method === "POST") {
    const schema = ty.object({
      subdomain: ty.string(),
      username: ty.string(),
    })

    const { subdomain, username } = schema.validate(
      await requestJsonObject(request),
    )

    const path = `users/${username}`

    tokenAssert(token, path, "read")

    const subdomainData = await Db.dataGet(ctx.db, `subdomains/${subdomain}`)
    if (subdomainData === undefined) {
      throw new Unauthorized(
        `[${who}] subdomain: ${subdomain} can not be used by username: ${username}`,
      )
    }

    const { usernames } = SubdomainSchema.validate(subdomainData)
    if (!usernames.includes(username)) {
      throw new Unauthorized(
        `[${who}] subdomain: ${subdomain} can not be used by username: ${username}`,
      )
    }

    const server = Net.createServer((socket) => {
      ctx.targets[subdomain] = new ReverseProxyTarget(socket)
    })

    const port = await findPort(9207)
    await serverListen(server, { port })
    return { port, keySize }
  }

  throw new Error(
    [`[${who}] unhandled http request`, `  method: ${request.method}`].join(
      "\n",
    ),
  )
}
