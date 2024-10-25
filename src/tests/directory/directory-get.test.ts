import { expect, test } from "vitest"
import { api } from "../../index.js"
import { prepareTestServer } from "../prepareTestServer.js"

test("directory-get", async ({ task }) => {
  const { ctx } = await prepareTestServer(task)

  {
    const results = await api.directoryGet(ctx, "")
    expect(Boolean(results.find(({ path }) => path === "users"))).toEqual(false)
    expect(Boolean(results.find(({ path }) => path === "posts"))).toEqual(false)
  }

  await api.dataCreate(ctx, `users/1`, {})

  {
    const results = await api.directoryGet(ctx, "")
    expect(Boolean(results.find(({ path }) => path === "users"))).toEqual(true)
    expect(Boolean(results.find(({ path }) => path === "posts"))).toEqual(false)
  }

  await api.dataCreate(ctx, `posts/1`, {})

  {
    const results = await api.directoryGet(ctx, "")
    expect(Boolean(results.find(({ path }) => path === "users"))).toEqual(true)
    expect(Boolean(results.find(({ path }) => path === "posts"))).toEqual(true)
  }
})
