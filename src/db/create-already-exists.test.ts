import { expect, test } from "vitest"
import * as Db from "../db"
import { AlreadyExists } from "./errors/AlreadyExists"
import { prepareTest } from "./test-utils"

test("create-already-exists", async () => {
  const { db } = await prepareTest()

  const created = await Db.create(db, {
    "@id": `users/${crypto.randomUUID()}`,
    username: "xieyuheng",
    name: "Xie Yuheng",
  })
  expect(await Db.get(db, created["@id"])).toEqual(created)

  await expect(
    Db.create(db, {
      "@id": created["@id"],
      username: "xieyuheng",
      name: "Xie Yuheng",
    }),
  ).rejects.toThrowError(AlreadyExists)
})