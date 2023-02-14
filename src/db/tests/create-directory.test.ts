import { expect, test } from "vitest"
import * as Db from "../../db"
import { arrayFromAsyncIterable } from "../../utils/arrayFromAsyncIterable"
import { prepareTestDb } from "./prepareTestDb"

test("create-directory", async ({ meta }) => {
  const db = await prepareTestDb(meta)

  expect((await arrayFromAsyncIterable(Db.listDirectories(db))).length).toEqual(
    0,
  )

  await Db.createDirectory(db, "users")

  expect((await arrayFromAsyncIterable(Db.listDirectories(db))).length).toEqual(
    1,
  )
  expect(
    (await arrayFromAsyncIterable(Db.listDirectories(db))).includes("users"),
  ).toEqual(true)
})