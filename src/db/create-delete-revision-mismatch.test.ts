import { expect, test } from "vitest"
import { randomRevision } from "../data"
import * as Db from "../db"
import { RevisionMismatch } from "../errors/RevisionMismatch"
import { prepareTestDb } from "./prepareTestDb"

test("create-delete-revision-mismatch", async () => {
  const db = await prepareTestDb()

  await Db.create(db, {
    "@path": "users/xieyuheng",
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  await expect(
    Db.delete(db, {
      "@path": "users/xieyuheng",
      "@revision": randomRevision(),
      name: "谢宇恒",
    }),
  ).rejects.toThrowError(RevisionMismatch)
})
