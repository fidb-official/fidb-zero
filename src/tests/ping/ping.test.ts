import { expect, test } from "vitest"
import { api } from "../../index"
import { prepareTestServer } from "../prepareTestServer"

test("ping", async ({ task }) => {
  const { ctx } = await prepareTestServer(task)

  expect(await api.ping(ctx)).toEqual("pong")
})
