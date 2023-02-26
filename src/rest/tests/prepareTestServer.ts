import Http from "node:http"
import * as Db from "../../db"
import { prepareTestDb } from "../../db/tests/prepareTestDb"
import * as Rest from "../../rest"
import { findPort } from "../../utils/findPort"
import { serverListen } from "../../utils/serverListen"

export async function prepareTestServer(options: { name: string }) {
  const { db } = await prepareTestDb(options)

  const server = Http.createServer()

  server.on("request", Rest.createRequestListener({ db }))

  const hostname = "127.0.0.1"
  const port = await findPort(3000)

  await serverListen(server, { port, hostname })

  const authorization = `token ${await Db.createToken(db, {
    permissionRecord: {
      "**": ["create", "read", "update", "delete"],
    },
  })}`

  const url = `http://${hostname}:${port}`

  return { url, db, authorization, server }
}
