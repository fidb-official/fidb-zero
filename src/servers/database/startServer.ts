import fs from "node:fs"
import Http from "node:http"
import Https from "node:https"
import { DatabaseConfig } from "../../database"
import { createRequestListener } from "../../server/createRequestListener"
import { serverListenWithDefault } from "../../server/serverListenWithDefault"
import { log } from "../../utils/log"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startServer(
  directory: string,
  config: DatabaseConfig,
): Promise<void> {
  const who = "database/startServer"

  const ctx = await createContext({ directory, config })
  log({ who, message: "createContext", ctx })

  const listener = createRequestListener({ ctx, handle, logger: config.logger })

  if (config.server?.tls) {
    const server = Https.createServer(
      {
        cert: await fs.promises.readFile(config.server.tls.cert),
        key: await fs.promises.readFile(config.server.tls.key),
      },
      listener,
    )
    await serverListenWithDefault(server, config.server)
  } else {
    const server = Http.createServer({}, listener)
    await serverListenWithDefault(server, config.server)
  }
}
