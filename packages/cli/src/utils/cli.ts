import checkNode from "cli-check-node"
import unhandledError from "cli-handle-unhandled"
import welcome from "cli-welcome"
import { readableColorIsBlack } from "color2k"
import updateNotifier from "update-notifier"
import JSON from "../../package.json"

export const initCLI = async (bgColor: string) => {
  checkNode("20")

  await unhandledError()

  const color = readableColorIsBlack(bgColor) ? `#000` : `#fff`

  welcome({
    title: "Yamada UI CLI",
    tagLine: `by Yamada UI\n${JSON.description}`,
    bgColor,
    color,
    bold: true,
    clear: false,
    version: JSON.version,
  })

  updateNotifier({
    pkg: JSON,
    shouldNotifyInNpmScript: true,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 3,
  }).notify({ isGlobal: true })
}
