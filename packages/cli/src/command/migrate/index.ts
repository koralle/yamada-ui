import * as p from "@clack/prompts"
import c from "chalk"
import type { DefaultOptions } from "../../utils"
import { getConfig } from "../../utils/config"

type Options = DefaultOptions & {
  // つけたいコマンドラインオプション
  // --exclude ... migrateコマンド実行時に除外するファイルを指定する
  //   * デフォルト値は[`node_modules`]
  //   * `.gitignore`を参照したい
  //   * 例: `pnpm yamada-cli migrate --exclude=node_modules,dist,build,.next`
  // --tsconfig-path ... tsconfig.jsonのパスを指定する
  //   * デフォルト値は`$(process.cwd())/tsconfig.json`
  //   * 例: `pnpm yamada-cli migrate --tsconfig-path ../tsconfig.json`
  // --num-threads (-J) ... <num-threads>個のスレッドで処理を行う
  //   * デフォルト値は1
  //   * 例: `pnpm yamada-cli migrate --num-threads 4`
  // --package-name ... `@yamada-ui/*`はここで指定したパッケージ名に書き換わる
  //   * デフォルト値は`.ui`
  //   * 例: `pnpm yamada-cli migrate --package-name yamada`
  // --force (-F) ... このオプションを指定すると、ユーザに確認をせずにファイルを上書きする
  //   * デフォルト値はfalse. つまり、ファイルを上書きする前にユーザに確認をする
  //   * 例: `pnpm yamada-cli migrate -F`
  force?: boolean
}

export default (hex: string) =>
  async (
    sourcePath: string,
    { cwd, config: configPath, force = false }: Options,
  ) => {
    p.intro(c.hex(hex)(`Migrating Yamada UI v1 to v2`))

    const s = p.spinner()

    if (!force) {
      const message = "Are you sure you want to overwrite the files?"
      const shouldContinue = await p.confirm({ message })

      if (!shouldContinue) {
        p.cancel(c.red("Canceled"))

        return
      }
    }

    try {
      const start = process.hrtime.bigint()

      const config = await getConfig(cwd, configPath)

      console.log(config)

      s.start(`Migrating v1 to v2`)

      // tsconfig.jsonのパスをコマンドライン引数から取得する
      // 取得したパスにtsconfig.jsonが存在するか確認する
      // 存在しなかったらエラーを出力して終了する

      // 各ソースファイルのAST解析を始める
      // やることは2つ。
      // 1. importしているモジュール名（`@yamada-ui/*`）を集めた配列を作る
      // 2. import { xxx } from '@yamada-ui/xxx' を import { xxx } from 'yyyy' に書き換える
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
