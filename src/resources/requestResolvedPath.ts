import Http from "node:http"
import { type Database } from "../database/index.js"
import { normalizePath } from "../database/normalizePath.js"
import { requestURL } from "../utils/node/requestURL.js"

export function requestResolvedPath(
  db: Database,
  request: Http.IncomingMessage,
): string {
  const url = requestURL(request)

  // NOTE `decodeURIComponent` is necessary for space.
  // For example
  //   'users/abc%20123'
  // will be decode to
  //   'users/abc 123'
  const path = normalizePath(db, decodeURIComponent(url.pathname.slice(1)))

  return path
}
