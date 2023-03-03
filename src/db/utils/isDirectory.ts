import fs from "node:fs"
import type { Database } from "../../database"
import { isErrnoException } from "../../utils/node/isErrnoException"
import { resolvePath } from "./resolvePath"

export async function isDirectory(
  db: Database,
  path: string,
): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(resolvePath(db, path))
    return stats.isDirectory()
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return false
    }

    throw error
  }
}
