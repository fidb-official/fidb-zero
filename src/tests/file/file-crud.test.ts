import { expect, test } from "vitest"
import { api } from "../../index.js"
import { prepareTestServer } from "../prepareTestServer.js"

test("file-crud", async ({ task }) => {
  const { ctx } = await prepareTestServer(task)

  const text = "Hello, I am Xie Yuheng."
  const bytes = new TextEncoder().encode(text)

  expect(await api.fileHas(ctx, `users/xieyuheng/human.txt`)).toEqual(false)
  await api.fileCreate(ctx, `users/xieyuheng/human.txt`, bytes)
  expect(await api.fileHas(ctx, `users/xieyuheng/human.txt`)).toEqual(true)
  expect(await api.fileGet(ctx, `users/xieyuheng/human.txt`)).toEqual(bytes)

  const newText = "Hello, I am Xie Yuheng from China."
  const newBytes = new TextEncoder().encode(newText)

  const error = await api.errorOrFail(() =>
    api.fileCreate(ctx, `users/xieyuheng/human.txt`, newBytes),
  )
  expect(error.statusCode).toEqual(403)

  await api.filePut(ctx, `users/xieyuheng/human.txt`, newBytes)
  expect(await api.fileGet(ctx, `users/xieyuheng/human.txt`)).toEqual(newBytes)

  await api.fileDelete(ctx, `users/xieyuheng/human.txt`)
  expect(await api.fileGet(ctx, `users/xieyuheng/human.txt`)).toEqual(undefined)
})
