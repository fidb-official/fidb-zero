import type { Database } from "../database"
import type { TokenPermissionRecord } from "../token"
import { randomTokenName } from "../token/randomTokenName"
import { dataCreate } from "./dataCreate"

export async function tokenCreate(
  db: Database,
  options: {
    permissionRecord: TokenPermissionRecord
  },
): Promise<string> {
  const tokenName = randomTokenName()

  await dataCreate(db, `tokens/${tokenName}`, {
    permissionRecord: options.permissionRecord,
  })

  return tokenName
}