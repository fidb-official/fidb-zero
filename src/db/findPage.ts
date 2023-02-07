import type { Data } from "../data"
import type { Database } from "../database"
import type { FindOptions } from "./find"
import { find } from "./find"

export type FindPageOptions = FindOptions & {
  page: number // NOTE starting from 1
  size: number
}

export async function* findPage(
  db: Database,
  directory: string,
  options: FindPageOptions,
): AsyncIterable<Data> {
  const offset = options.page - 1
  const start = offset * options.size
  const end = start + options.size
  let count = 0

  for await (const data of find(db, directory, options)) {
    if (start <= count && count < end) {
      count++
      yield data
    } else {
      break
    }
  }
}
