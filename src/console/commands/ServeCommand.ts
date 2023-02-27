import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { resolve } from "node:path"
import { createDatabase } from "../../database"
import * as Rest from "../../rest"
import { createRequestListener } from "../../utils/createRequestListener"
import { log } from "../../utils/log"
import { connectReverseProxy } from "./connectReverseProxy"
import { startServer } from "./startServer"

type Args = { path: string }
type Opts = {
  hostname?: string
  port?: number
  "tls-cert"?: string
  "tls-key"?: string
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
    "tls-cert": ty.optional(ty.string()),
    "tls-key": ty.optional(ty.string()),
    "reverse-proxy-server": ty.optional(ty.string()),
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
    const who = "ServeCommand.execute"

    const db = await createDatabase({ path: resolve(argv.path) })

    log({ who, db })

    const requestListener = createRequestListener({
      ctx: { db },
      handle: Rest.handle,
    })

    const { url } = await startServer({ who, ...argv }, requestListener)

    if (
      argv["reverse-proxy-server"] &&
      argv["reverse-proxy-username"] &&
      argv["reverse-proxy-password"]
    ) {
      await connectReverseProxy({
        server: { url: new URL(argv["reverse-proxy-server"]) },
        username: argv["reverse-proxy-username"],
        password: argv["reverse-proxy-password"],
        target: {
          hostname: url.hostname,
          port: Number(url.port),
        },
      })
    }
  }
}
