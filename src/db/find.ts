import { all, Data, Database } from "."
import type { JsonAtom } from "../utils/Json"

export type FindOptions = {
  properties: Record<string, JsonAtom>
}

export async function* find(
  db: Database,
  prefix: string,
  options: FindOptions,
): AsyncIterable<Data> {
  for await (const data of all(db, prefix)) {
    if (
      Object.entries(options.properties).every(
        ([key, property]) => data[key] === property,
      )
    ) {
      yield data
    }
  }
}
