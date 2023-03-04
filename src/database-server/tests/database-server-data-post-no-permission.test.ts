import { expect, test } from "vitest"
import * as Db from "../../db"
import { prepareTestServer } from "./prepareTestServer"

test("database-server-data-post-no-permission", async ({ meta }) => {
  const { url, db } = await prepareTestServer(meta)

  const authorization = `token ${await Db.tokenCreate(db, {
    permissionRecord: {
      "users/*/**": ["read"],
      "users/xyh/**": ["create", "read", "update", "delete"],
    },
  })}`

  expect(
    (
      await fetch(new URL(`/users/xieyuheng`, url), {
        method: "POST",
        headers: {
          authorization,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "xieyuheng",
          name: "Xie Yuheng",
        }),
      })
    ).status,
  ).toEqual(401)
})