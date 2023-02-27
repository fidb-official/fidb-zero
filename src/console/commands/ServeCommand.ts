import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import fs from "node:fs"
import Http from "node:http"
import Https from "node:https"
import { resolve } from "node:path"
import { createDatabase } from "../../database"
import * as Rest from "../../rest"
import { createRequestListener } from "../../utils/createRequestListener"
import { findPort } from "../../utils/findPort"
import { serverListen } from "../../utils/serverListen"
import { connectReverseProxy } from "./connectReverseProxy"

type Args = { path: string }
type Opts = {
  hostname?: string
  port?: number
  cert?: string
  key?: string

  "reverse-proxy-server"?: string
  "reverse-proxy-username"?: string
  "reverse-proxy-password"?: string
}

export class ServeCommand extends Command<Args> {
  name = "serve"

  description = "Serve a database"

  args = { path: ty.string() }
  opts = {
    hostname: ty.optional(ty.string()),
    port: ty.optional(ty.number()),
    cert: ty.optional(ty.string()),
    key: ty.optional(ty.string()),

    "reverse-proxy-server": ty.optional(ty.number()),
    "reverse-proxy-username": ty.optional(ty.string()),
    "reverse-proxy-password": ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a path to a directory,`,
      `and serve it as a database.`,
      ``,
      blue(`  ${runner.name} ${this.name} tmp/databases/test`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const db = await createDatabase({ path: resolve(argv.path) })

    const requestListener = createRequestListener({
      ctx: { db },
      handle: Rest.handle,
    })

    const hostname = argv.hostname || "127.0.0.1"
    const port = process.env.PORT || argv.port || (await findPort(3000))

    if (argv.cert && argv.key) {
      const server = Https.createServer({
        cert: await fs.promises.readFile(argv.cert),
        key: await fs.promises.readFile(argv.key),
      })

      server.on("request", requestListener)

      await serverListen(server, { hostname, port })

      console.dir(
        {
          who: `[ServeCommand.execute]`,
          url: `https://${hostname}:${port}`,
          db,
        },
        {
          depth: null,
        },
      )
    } else {
      const server = Http.createServer()

      server.on("request", requestListener)

      await serverListen(server, { hostname, port })

      console.dir(
        {
          who: `[ServeCommand.execute]`,
          url: `http://${hostname}:${port}`,
          db,
        },
        {
          depth: null,
        },
      )
    }

    if (
      argv["reverse-proxy-server"] &&
      argv["reverse-proxy-username"] &&
      argv["reverse-proxy-password"]
    ) {
      await connectReverseProxy({
        reverseProxy: {
          server: argv["reverse-proxy-server"],
          username: argv["reverse-proxy-username"],
          password: argv["reverse-proxy-password"],
        },
        target: {
          hostname,
          port,
        },
      })
    }
  }
}
