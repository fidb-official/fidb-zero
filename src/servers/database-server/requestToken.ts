import type Http from "node:http"
import * as Db from "../../db"
import { Unauthorized } from "../../errors/Unauthorized"
import { requestTokenName } from "../../server/requestTokenName"
import type { Token } from "../../token"
import type { Context } from "./Context"

export async function requestToken(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Token> {
  const tokenName = requestTokenName(request)
  if (tokenName === undefined) {
    throw new Unauthorized(`[requestToken] not token in authorization header`)
  }

  const token = await Db.tokenGetOrFail(ctx.db, tokenName)
  return token
}
