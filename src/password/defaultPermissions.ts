import { Operation, readOperations } from "../operation"

export const defaultPermissions: Record<string, Array<Operation>> = {
  users: ["directory:get"],
  "users/*/public/**": readOperations,
}