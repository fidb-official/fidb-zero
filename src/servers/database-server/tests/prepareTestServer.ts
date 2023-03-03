import Http from "node:http"
import * as Db from "../../../db"
import { prepareTestDb } from "../../../db/tests/prepareTestDb"
import { createRequestListener } from "../../../server/createRequestListener"
import { serverListen } from "../../../server/serverListen"
import { findPort } from "../../../utils/node/findPort"
import { handle } from "../../database-server"

export async function prepareTestServer(options: { name: string }) {
  const { db } = await prepareTestDb(options)

  const requestListener = createRequestListener({
    ctx: { db },
    handle,
  })

  const server = Http.createServer()

  server.on("request", requestListener)

  const hostname = "127.0.0.1"
  const port = await findPort(3000)

  await serverListen(server, { port, hostname })

  const authorization = `token ${await Db.tokenCreate(db, {
    permissionRecord: {
      "**": ["create", "read", "update", "delete"],
    },
  })}`

  const url = `http://${hostname}:${port}`

  return { url, db, authorization, server }
}
