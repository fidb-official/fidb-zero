import { expect, test } from "vitest"
import { api } from "../../index.js"
import { type PathEntry } from "../../resources/directory/PathEntry.js"
import { prepareTestServer } from "../prepareTestServer.js"

test("directory-get-file-metadata", async ({ task }) => {
  const { ctx } = await prepareTestServer(task)

  await api.filePut(ctx, `contents/1.md`, "hi")
  await api.filePut(ctx, `contents/2.md`, "hello")

  {
    const results = await api.directoryGet(ctx, `contents`)
    expect(results.length).toEqual(2)
    expect(
      Boolean(
        results.find(
          (entry: PathEntry) =>
            entry.kind === "File" &&
            entry.path === "contents/1.md" &&
            typeof entry.createdAt === "number" &&
            typeof entry.updatedAt === "number" &&
            entry.size === "hi".length,
        ),
      ),
    ).toEqual(true)
    expect(
      Boolean(
        results.find(
          (entry: PathEntry) =>
            entry.kind === "File" &&
            entry.path === "contents/2.md" &&
            typeof entry.createdAt === "number" &&
            typeof entry.updatedAt === "number" &&
            entry.size === "hello".length,
        ),
      ),
    ).toEqual(true)
  }
})
