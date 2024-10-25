import { normalize, resolve } from "node:path"
import { Unauthorized } from "../errors/index.js"
import { type Database } from "./Database.js"

export function resolvePath(db: Database, path: string): string {
  const who = "resolvePath"

  const resolvedPath = normalize(resolve(db.directory, path))

  if (!resolvedPath.startsWith(db.directory)) {
    throw new Unauthorized(
      `[${who}] can not access path: ${path}, which is outside of database path`,
    )
  }

  return resolvedPath
}
