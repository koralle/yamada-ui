import * as p from "@clack/prompts"
import c from "chalk"
import type { DefaultOptions } from "../../utils"
import { getConfig } from "../../utils/config"

type Options = DefaultOptions & {}

export default (hex: string) =>
  async (sourcePath: string, { cwd, config: configPath }: Options) => {
    p.intro(c.hex(hex)(`Migrating Yamada UI v1 to v2`))

    const s = p.spinner()

    try {
      const start = process.hrtime.bigint()

      const config = await getConfig(cwd, configPath)

      console.log(config)

      s.start(`Migrating v1 to v2`)

      p.note(sourcePath, "Source path")

      s.stop(`Migrated v1 to v2`)

      const end = process.hrtime.bigint()
      const duration = (Number(end - start) / 1e9).toFixed(2)

      p.outro(c.green(`Done in ${duration}s\n`))
    } catch (e) {
      s.stop(`An error occurred`, 500)

      p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
    }
  }
