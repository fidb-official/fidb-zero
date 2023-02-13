import { resolve } from "node:path"
import { Data, dataSchema } from "../data"
import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { isErrnoException } from "../utils/isErrnoException"
import { readJson } from "../utils/readJson"

export async function getOrFail(db: Database, path: string): Promise<Data> {
  try {
    const json = await readJson(resolve(db.path, path))
    const data = dataSchema.validate(json)
    return data
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw new NotFound(`[getOrFail] path: ${path}`)
    }

    throw error
  }
}
