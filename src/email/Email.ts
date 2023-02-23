import ty, { Schema } from "@xieyuheng/ty"
import { Data, dataSchema } from "../data"

export type Email = Data & {
  address: string
}

export const emailSchema: Schema<Email> = ty.intersection(
  dataSchema,
  ty.object({
    address: ty.email(),
  }),
)
