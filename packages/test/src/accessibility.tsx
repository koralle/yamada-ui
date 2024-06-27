import type { RenderOptions } from "@testing-library/react"
import { isArray, isString } from "@yamada-ui/utils"
import type { ImpactValue, RunOptions, Spec } from "axe-core"
import type { ReactElement } from "react"
import { isValidElement } from "react"
import { axe } from "vitest-axe"
import type { AxeMatchers } from "vitest-axe/matchers"
import { render } from "./render"

declare module "vitest" {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

type A11yConfigureOptions = RunOptions & {
  globalOptions?: Spec
  impactLevels?: ImpactValue[]
}

export type A11yProps = RenderOptions & { axeOptions?: A11yConfigureOptions }

export const a11y = async (
  ui: ReactElement | HTMLElement,
  { axeOptions, ...rest }: A11yProps = {},
): Promise<void> => {
  const container = isValidElement(ui) ? render(ui, rest).container : ui
  const results = await axe(container as HTMLElement, axeOptions)

  expect(results).toHaveNoViolations()
}

export const filterVisuallyHidden =
  (targetContent: string) => (content: string, el: Element | null) => {
    if (!el || content !== targetContent) return false

    const style = window.getComputedStyle(el)
    const visuallyHiddenStyle = {
      border: ["0", "0px"],
      clip: ["rect(0, 0, 0, 0)", "rect(0px, 0px, 0px, 0px)"],
      height: "1px",
      width: "1px",
      margin: "-1px",
      padding: ["0", "0px"],
      overflow: "hidden",
      whiteSpace: "nowrap",
      position: "absolute",
    }

    const isVisuallyHidden = Object.entries(visuallyHiddenStyle).every(
      ([key, value]) => {
        if (isArray(value)) {
          const targetValue = style[key as keyof CSSStyleDeclaration]

          return isString(targetValue) && value.includes(targetValue)
        } else {
          return style[key as keyof CSSStyleDeclaration] === value
        }
      },
    )

    return !isVisuallyHidden
  }
