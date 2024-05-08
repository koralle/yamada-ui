import * as p from "@clack/prompts"
import c from "chalk"
import type { DefaultOptions } from "../../utils"

type Options = DefaultOptions & {}

export default (hex: string) =>
  async ({}: Options) => {
    p.intro(c.hex(hex)(`initialize your project and install dependencies`))

    const s = p.spinner()

    try {
      const start = process.hrtime.bigint()

      const end = process.hrtime.bigint()
      const duration = (Number(end - start) / 1e9).toFixed(2)

      p.outro(c.green(`Done in ${duration}s\n`))
    } catch (e) {
      s.stop(`An error occurred`, 500)

      p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
    }
  }
