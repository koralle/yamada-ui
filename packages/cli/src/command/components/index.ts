import * as p from "@clack/prompts"
import c from "chalk"
import type { DefaultOptions } from "../../utils"
import { getConfig } from "../../utils/config"

type Options = DefaultOptions & {}

export default (hex: string) =>
  async (componentNames: string[], { cwd, config: configPath }: Options) => {
    p.intro(c.hex(hex)(`Generating Yamada UI components`))

    const s = p.spinner()

    try {
      const start = process.hrtime.bigint()

      const componentName = componentNames[0]

      s.start(`Generating the ${componentName}`)

      const config = await getConfig(cwd, configPath)

      console.log(config)

      p.note(componentName, "Component name")

      s.stop(`Generated the ${componentName}`)

      const end = process.hrtime.bigint()
      const duration = (Number(end - start) / 1e9).toFixed(2)

      p.outro(c.green(`Done in ${duration}s\n`))
    } catch (e) {
      s.stop(`An error occurred`, 500)

      p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
    }
  }
