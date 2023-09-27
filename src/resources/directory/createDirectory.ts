import fs from "node:fs"
import { Database } from "../../database"
import { resolvePath } from "../utils/resolvePath"

export async function createDirectory(
  db: Database,
  directory: string,
): Promise<void> {
  await fs.promises.mkdir(resolvePath(db, directory), {
    recursive: true,
  })
}