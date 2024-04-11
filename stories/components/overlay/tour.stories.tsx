import type { Meta, StoryFn } from "@storybook/react"
import { Tour } from "@yamada-ui/react"

type Story = StoryFn<typeof Tour>

const meta: Meta<typeof Tour> = {
  title: "Components / Overlay / Tour",
  component: Tour,
}

export default meta

export const basic: Story = () => {
  return <Tour></Tour>
}
