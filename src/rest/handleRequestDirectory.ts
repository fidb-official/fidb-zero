import type Http from "node:http"
import type { Database } from "../database"
import * as Db from "../db"
import { tokenAssert } from "../token"
import { arrayFromAsyncIterable } from "../utils/arrayFromAsyncIterable"
import type { Json } from "../utils/Json"
import type { HandleRequestOptions } from "./handleRequest"
import { requestToken } from "./requestToken"

export async function handleRequestDirectory(
  request: Http.IncomingMessage,
  db: Database,
  options: HandleRequestOptions,
): Promise<Json | void> {
  const { path, query, kind } = options

  const token = await requestToken(request, db)

  if (request.method === "GET") {
    tokenAssert(token, path, "read")
    return await arrayFromAsyncIterable(
      Db.listDirectory(db, path, {
        page: query.page ? Number.parseInt(query.page) : 1,
        size: query.size ? Number.parseInt(query.size) : 15,
      }),
    )
  }

  if (request.method === "POST") {
    tokenAssert(token, path, "create")
    return await Db.createDirectory(db, path)
  }

  if (request.method === "DELETE") {
    tokenAssert(token, path, "delete")
    if (path === "") return

    return await Db.deleteDirectory(db, path)
  }

  throw new Error(
    [
      `[handleRequestDirectory] unhandled http request`,
      `  method: ${request.method}`,
      `  path: ${path}`,
    ].join("\n"),
  )
}
