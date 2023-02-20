import { expect, test } from "vitest"
import * as Db from "../../db"
import { arrayFromAsyncIterable } from "../../utils/arrayFromAsyncIterable"
import type { PathEntry } from "../PathEntry"
import { prepareTestDb } from "./prepareTestDb"

test("db-delete-directory", async ({ meta }) => {
  const db = await prepareTestDb(meta)

  expect((await arrayFromAsyncIterable(Db.list(db))).length).toEqual(0)

  await Db.createDirectory(db, "users")

  expect((await arrayFromAsyncIterable(Db.list(db))).length).toEqual(1)
  expect(
    Boolean(
      (await arrayFromAsyncIterable(Db.list(db))).find(
        ({ path }: PathEntry) => path === "users",
      ),
    ),
  ).toEqual(true)

  await Db.deleteDirectory(db, "users")

  expect((await arrayFromAsyncIterable(Db.list(db))).length).toEqual(0)
})