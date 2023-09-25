import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { dirname, join, resolve } from "node:path"
import { readDatabaseConfigFile } from "../../database/readDatabaseConfigFile"
import { startServer } from "../../servers/database/startServer"
import { pathIsFile } from "../../utils/node/pathIsFile"

type Args = { path: string }
type Opts = {}

export class ServeCommand extends Command<Args> {
  name = "serve"

  description = "Serve a database"

  args = { path: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a path`,
      `to a database directory or to a ${blue('database.json')} file,`,
      `and serve it as a database.`,
      ``,
      blue(`  ${runner.name} ${this.name} tmp/databases/test`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (await pathIsFile(argv.path)) {
      const path = resolve(argv.path)
      const directory = dirname(path)
      const configFile = path
      const config = await readDatabaseConfigFile(configFile)
      const db = { directory, config }
      await startServer(db)
    } else {
      const path = resolve(argv.path)
      const directory = path
      const configFile = join(path, "database.json")
      const config = await readDatabaseConfigFile(configFile)
      const db = { directory, config }
      await startServer(db)
    }
  }
}
