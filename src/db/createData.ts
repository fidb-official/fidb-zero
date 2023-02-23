import { normalize } from "node:path"
import { Data, randomRevision } from "../data"
import type { Database } from "../database"
import { AlreadyExists } from "../errors/AlreadyExists"
import type { JsonObject } from "../utils/Json"
import { getData } from "./getData"
import { writeData } from "./utils/writeData"

export async function createData(
  db: Database,
  path: string,
  input: JsonObject,
): Promise<Data> {
  const data = await getData(db, path)
  if (data !== undefined) {
    throw new AlreadyExists(`[create] already exists, @path: ${path}`)
  }

  const result = {
    ...input,
    "@path": normalize(path),
    "@revision": randomRevision(),
    "@createdAt": Date.now(),
    "@updatedAt": Date.now(),
  }

  await writeData(db, path, result)

  return result
}