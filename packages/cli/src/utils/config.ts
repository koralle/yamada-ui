import { readFile } from "fs/promises"
import path from "path"
import type { Dict } from "./assertion"
import { merge } from "./object"

const onValidConfig = (config: Dict): Config => {
  return config as Config
}

export const getConfig = async (
  cwd?: string,
  configPath: string = "ui.config.json",
) => {
  const resolvedConfigPath = path.resolve(cwd ?? process.cwd(), configPath)

  let config: UsageConfig

  try {
    const data = await readFile(resolvedConfigPath, "utf-8")

    config = JSON.parse(data) as UsageConfig
  } catch {
    config = DEVELOP_CONFIG
  }

  const mergedConfig = merge(DEFAULT_CONFIG, config)
  const resolvedConfig = onValidConfig(mergedConfig)

  return resolvedConfig
}

export type Config = {
  options: {
    dirPath: string
  }
  theme: {
    module: string
    outputPath: string
    include?: string[]
    exclude?: string[]
  }
  tokens: {
    sourcePath?: string
    outputPath?: string
  }
  components?: string[]
}

export type UsageConfig = {
  options?: {
    dirPath?: string
  }
  theme?: {
    module?: string
    outputPath?: string
    include?: string[]
    exclude?: string[]
  }
  tokens?: {
    sourcePath?: string
    outputPath?: string
  }
  components?: string[]
}

const DEFAULT_CONFIG: UsageConfig = {
  options: {
    dirPath: ".ui",
  },
  theme: {
    module: "default",
    outputPath: "./theme",
  },
  tokens: {},
}

const DEVELOP_CONFIG: UsageConfig = {
  options: {},
  theme: {},
  tokens: {},
}
