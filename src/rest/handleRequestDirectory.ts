import type Http from "node:http"
import type { Database } from "../database"
import * as Db from "../db"
import { Unauthorized } from "../errors/Unauthorized"
import { tokenCheckReadable, tokenCheckWriteable } from "../token"
import { arrayFromAsyncIterable } from "../utils/arrayFromAsyncIterable"
import type { Json } from "../utils/Json"
import type { HandleRequestOptions } from "./handleRequest"

export async function handleRequestDirectory(
  request: Http.IncomingMessage,
  db: Database,
  options: HandleRequestOptions,
): Promise<Json | void> {
  const { path, token } = options

  if (!tokenCheckReadable(token, path)) {
    throw new Unauthorized(
      `[handleRequestDirectory] not permitted to read path: ${path}`,
    )
  }

  if (request.method === "GET") {
    return await arrayFromAsyncIterable(Db.list(db, path))
  }

  if (!tokenCheckWriteable(token, path)) {
    throw new Unauthorized(
      `[handleRequestDirectory] not permitted to write path: ${path}`,
    )
  }

  if (request.method === "POST") {
    return await Db.createDirectory(db, path)
  }

  if (request.method === "DELETE") {
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