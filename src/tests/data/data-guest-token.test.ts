import { expect, test } from "vitest"
import { createClientContext } from "../../client/index.js"
import { api } from "../../index.js"
import { prepareTestServer } from "../prepareTestServer.js"

test("data-guest-token", async ({ task }) => {
  const { ctx } = await prepareTestServer(task)

  await api.dataCreate(ctx, `users/xieyuheng`, {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  await api.dataCreate(ctx, `users/xieyuheng/projects/inner`, {
    name: "inner",
    description: "Ones inner universe.",
  })

  await api.dataCreate(ctx, `users/xieyuheng/public/projects/inner`, {
    name: "inner",
    description: "Ones inner universe.",
  })

  const newctx = await createClientContext(ctx.url, "guest")

  {
    // The guest token can NOT read non public data.

    const error = await api.errorOrFail(() =>
      api.dataGet(newctx, `users/xieyuheng/projects/inner`),
    )

    expect(error.statusCode).toEqual(401)
  }

  {
    // The guest token can read user data.

    await api.dataGetOrFail(newctx, `users/xieyuheng`)
  }

  {
    // The guest token can read public data.

    const project = await api.dataGetOrFail(
      newctx,
      `users/xieyuheng/public/projects/inner`,
    )

    expect(project.name).toEqual("inner")
    expect(project.description).toEqual("Ones inner universe.")
  }
})
