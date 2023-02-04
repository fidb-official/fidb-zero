import fs from "node:fs"
import { resolve } from "node:path"
import type { Database } from "."

export async function remove(db: Database, id: string): Promise<void> {
  await fs.promises.rm(resolve(db.path, id), { force: true })
}