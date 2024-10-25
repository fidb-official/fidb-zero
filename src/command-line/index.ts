import { CommandRunner, CommandRunners } from "@xieyuheng/command-line"
import * as Commands from "./commands/index.js"

export function createCommandRunner(): CommandRunner {
  return new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.Default(),
    commands: [
      new Commands.CommonHelp(),
      new Commands.InitDatabase(),
      new Commands.ServeDatabase(),
      new Commands.ServeSubdomain(),
      new Commands.MakeUser(),
    ],
  })
}
