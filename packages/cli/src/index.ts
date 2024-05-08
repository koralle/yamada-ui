import { program } from "commander"
import components from "./command/components"
import init from "./command/init"
import migrate from "./command/migrate"
import theme from "./command/theme"
import tokens from "./command/tokens"
import { initCLI } from "./utils"
import { hexes } from "./utils/colors"

type OptionArgs = [
  flags: string,
  description?: string,
  defaultValue?: string | boolean | string[],
]

const CONFIG_ARGS: OptionArgs = [
  "-c, --config <path>",
  "Path to output config file",
]
const CWD_ARGS: OptionArgs = [
  "--cwd <cwd>",
  "the working directory. defaults to the current directory.",
]

export const run = async () => {
  const hex = hexes[Math.floor(Math.random() * hexes.length)]

  await initCLI(hex)

  program
    .command("init")
    .option(...CONFIG_ARGS)
    .option(...CWD_ARGS)
    .option("-t, --theme <path>", "Path to output theme")
    .action(init(hex))

  program
    .command("tokens <source>")
    .option(...CONFIG_ARGS)
    .option(...CWD_ARGS)
    .option("-o, --out <path>", `Path to output file`)
    .option("-w, --watch [path]", "Watch directory for changes and rebuild")
    .action(tokens(hex))

  program
    .command("add [names...]")
    .option(...CONFIG_ARGS)
    .option(...CWD_ARGS)
    .action(components(hex))

  program
    .command("migrate [source]")
    .option("-c, --config <path>", "Path to config file")
    .action(migrate(hex))

  program
    .command("theme [name]")
    .option(...CONFIG_ARGS)
    .option(...CWD_ARGS)
    .option("-o, --out <path>", `Path to output theme`)
    .action(theme(hex))

  program.parse()
}
