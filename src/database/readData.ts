import fs from "node:fs"
import { normalize } from "node:path"
import { type Data, DataSchema, type Database } from "../database/index.js"
import { readJsonObject } from "../utils/node/readJsonObject.js"
import { randomRevision } from "./randomRevision.js"
import { resolveDataPath } from "./resolveDataPath.js"
import { writeData } from "./writeData.js"

export async function readData(db: Database, path: string): Promise<Data> {
  path = normalize(path)
  const resolvedPath = resolveDataPath(db, path)

  const json = await readJsonObject(resolvedPath)

  const revision =
    typeof json["@revision"] === "string" ? json["@revision"] : randomRevision()

  const createdAt =
    typeof json["@createdAt"] === "number"
      ? json["@createdAt"]
      : Math.floor((await fs.promises.stat(resolvedPath)).ctimeMs)

  const updatedAt =
    typeof json["@updatedAt"] === "number" ? json["@updatedAt"] : createdAt

  const data = {
    ...json,
    "@path": path,
    "@revision": revision,
    "@createdAt": createdAt,
    "@updatedAt": updatedAt,
  }

  if (!DataSchema.isValid(json)) {
    await writeData(db, path, data)
  }

  return data
}
