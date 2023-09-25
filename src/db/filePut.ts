import { Buffer } from "node:buffer"
import { Database } from "../database"
import { writeBuffer } from "./utils/writeBuffer"

export async function filePut(
  db: Database,
  path: string,
  buffer: Buffer,
): Promise<void> {
  await writeBuffer(db, path, buffer)
}
