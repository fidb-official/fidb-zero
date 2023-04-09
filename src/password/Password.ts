import ty, { Schema } from "@xieyuheng/ty"
import { Data, DataSchema } from "../data"
import { Operation, OperationSchema } from "../token/Operation"

export type Password = Data & {
  memo: string
  hash: string
  permissions: Array<Operation>
}

export const PasswordSchema: Schema<Password> = ty.intersection(
  DataSchema,
  ty.object({
    memo: ty.string(),
    hash: ty.string(),
    permissions: ty.array(OperationSchema),
  }),
)
