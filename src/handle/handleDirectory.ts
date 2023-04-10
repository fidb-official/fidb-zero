import type Http from "node:http"
import * as Db from "../db"
import { tokenAssert } from "../token"
import type { Json } from "../utils/Json"
import { arrayFromAsyncIterable } from "../utils/arrayFromAsyncIterable"
import { requestKind } from "../utils/node/requestKind"
import { requestQuery } from "../utils/node/requestQuery"
import type { Context } from "./Context"
import { requestPath } from "./requestPath"
import { requestToken } from "./requestToken"

export async function handleDirectory(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  const { db } = ctx

  const kind = requestKind(request)
  const query = requestQuery(request)
  const path = requestPath(ctx, request)
  const token = await requestToken(request)

  if (request.method === "GET") {
    await tokenAssert(db, token, path, "directory:get")
    return await arrayFromAsyncIterable(
      Db.directoryList(db, path, {
        page: query.page ? Number.parseInt(query.page) : 1,
        size: query.size ? Number.parseInt(query.size) : 15,
      }),
    )
  }

  if (request.method === "POST") {
    await tokenAssert(db, token, path, "directory:post")
    return await Db.directoryCreate(db, path)
  }

  if (request.method === "DELETE") {
    await tokenAssert(db, token, path, "directory:delete")
    if (path === "") return

    return await Db.directoryDelete(db, path)
  }

  throw new Error(
    [
      `[handleDirectory] unhandled http request`,
      `  method: ${request.method}`,
      `  path: ${path}`,
    ].join("\n"),
  )
}
