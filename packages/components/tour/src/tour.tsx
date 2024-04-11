import type { CSSUIObject, HTMLUIProps, ThemeProps } from "@yamada-ui/core"
import {
  forwardRef,
  omitThemeProps,
  ui,
  useMultiComponentStyle,
} from "@yamada-ui/core"
import { createContext, cx } from "@yamada-ui/utils"

type TourContext = Record<string, CSSUIObject>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [TourProvider, useTour] = createContext<TourContext>({
  strict: false,
  name: "TourContext",
})

type TourOptions = {}

export type TourProps = HTMLUIProps<"div"> & ThemeProps<"Tour"> & TourOptions

export const Tour = forwardRef<TourProps, "div">((props, ref) => {
  const [styles, mergedProps] = useMultiComponentStyle("Tour", props)
  const { className, ...rest } = omitThemeProps(mergedProps)

  const css: CSSUIObject = {}

  return (
    <TourProvider value={styles}>
      <ui.div
        ref={ref}
        className={cx("ui-tour", className)}
        __css={css}
        {...rest}
      />
    </TourProvider>
  )
})
