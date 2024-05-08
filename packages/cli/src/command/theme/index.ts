import * as p from "@clack/prompts"
import c from "chalk"
import type { DefaultOptions } from "../../utils"
import { getConfig } from "../../utils/config"

type Options = DefaultOptions & {}

export default (hex: string) =>
  async (themeName: string, { cwd, config: configPath }: Options) => {
    p.intro(c.hex(hex)(`Generating Yamada UI theme`))

    const s = p.spinner()

    try {
      const start = process.hrtime.bigint()

      s.start(`Generating the theme`)

      const config = await getConfig(cwd, configPath)

      console.log(config)

      p.note(themeName, "Theme name")

      s.stop(`Generated the theme`)

      const end = process.hrtime.bigint()
      const duration = (Number(end - start) / 1e9).toFixed(2)

      p.outro(c.green(`Done in ${duration}s\n`))
    } catch (e) {
      s.stop(`An error occurred`, 500)

      p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
    }
  }
