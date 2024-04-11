import { a11y, render } from "@yamada-ui/test"
import { Tour } from "../src"

describe("<Tour />", () => {
  test("Tour renders correctly", async () => {
    const { container } = render(<Tour />)
    await a11y(container)
  })
})
