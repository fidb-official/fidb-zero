import { type Data, type Database } from "../../database/index.js"
import { type DataFindAllOptions, dataFindAll } from "./dataFindAll.js"

export type DataFindOptions = DataFindAllOptions & {
  page: number // NOTE starting from 1
  size: number
}

export async function* dataFind(
  db: Database,
  directory: string,
  options: DataFindOptions,
): AsyncIterable<Data> {
  const offset = options.page - 1
  const start = offset * options.size
  const end = start + options.size
  let count = 0

  for await (const data of dataFindAll(db, directory, options)) {
    if (count >= end) {
      break
    }

    if (start <= count && count < end) {
      yield data
    }

    count++
  }
}
