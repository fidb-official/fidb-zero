import { expect, test } from "vitest"
import { api } from "../../index"
import { prepareTestServer } from "../prepareTestServer"

test("data-crud", async ({ task }) => {
  const { url, ctx, authorization } = await prepareTestServer(task)

  const created = await api.createData(ctx, `users/xieyuheng`, {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  expect(created.name).toEqual("Xie Yuheng")

  expect(await api.getData(ctx, `users/xieyuheng`)).toEqual(created)

  const putted = await (
    await fetch(new URL(`users/xieyuheng`, url), {
      method: "PUT",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "@revision": created["@revision"],
        name: "谢宇恒",
      }),
    })
  ).json()

  expect(putted.username).toEqual(undefined)
  expect(putted.name).toEqual("谢宇恒")
  expect(await api.getData(ctx, `users/xieyuheng`)).toEqual(putted)

  const patched = await (
    await fetch(new URL(`users/xieyuheng`, url), {
      method: "PATCH",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "@revision": putted["@revision"],
        username: "xyh",
      }),
    })
  ).json()

  expect(patched.username).toEqual("xyh")
  expect(patched.name).toEqual("谢宇恒")
  expect(await api.getData(ctx, `users/xieyuheng`)).toEqual(patched)

  await api.deleteData(ctx, `users/xieyuheng`, patched)

  expect(await api.getData(ctx, `users/xieyuheng`)).toEqual(undefined)
})
