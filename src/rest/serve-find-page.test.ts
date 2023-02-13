import qs from "qs"
import { expect, test } from "vitest"
import { serveTestDb } from "./serveTestDb"

test("serve-find-page", async () => {
  const { url } = await serveTestDb()

  const array = [
    { "@path": "users/0", country: "China" },
    { "@path": "users/1" },
    { "@path": "users/2", country: "China" },
    { "@path": "users/3" },
    { "@path": "users/4", country: "China" },
    { "@path": "users/5" },
    { "@path": "users/6", country: "China" },
    { "@path": "users/7" },
    { "@path": "users/8", country: "China" },
    { "@path": "users/9" },
  ]

  for (const data of array) {
    await fetch(`${url}/${data["@path"]}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  expect(
    (
      await (
        await fetch(
          `${url}/users?${qs.stringify({
            page: 1,
            size: 3,
            properties: {
              country: "China",
            },
          })}`,
        )
      ).json()
    ).results.length,
  ).toEqual(3)

  expect(
    (
      await (
        await fetch(
          `${url}/users?${qs.stringify({
            page: 2,
            size: 3,
            properties: {
              country: "China",
            },
          })}`,
        )
      ).json()
    ).results.length,
  ).toEqual(2)
})
