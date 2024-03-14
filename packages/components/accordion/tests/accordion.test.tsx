import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Icon } from "@yamada-ui/fontawesome"
import { a11y, render } from "@yamada-ui/test"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  AccordionPanel,
} from "../src"

describe("<Accordion />", () => {
  test("Accordion renders correctly", async () => {
    const { container } = render(
      <Accordion>
        <AccordionItem label="Accordion Label">
          This is an accordion item
        </AccordionItem>
      </Accordion>,
    )
    await a11y(container)
  })

  test("should render correctly with defaultIndex item expanded", async () => {
    const { user, findByTestId } = render(
      <Accordion isToggle defaultIndex={0}>
        <AccordionItem data-testid="accordion-item" label="Accordion Label 1">
          This is the first accordion item
        </AccordionItem>
        <AccordionItem label="Accordion Label 2">
          This is the second accordion item
        </AccordionItem>
      </Accordion>,
    )

    const firstAccodionItem = await findByTestId("accordion-item")
    const button = firstAccodionItem.querySelector("button")
    expect(button).toHaveAttribute("aria-expanded", "true")

    // toggle the accordion item
    await user.click(button!)

    const icon = firstAccodionItem.querySelector(".ui-icon")
    expect(icon).toHaveAttribute("aria-hidden", "true")
  })

  test("should show multiple items", async () => {
    const { findAllByRole } = render(
      <Accordion defaultIndex={[0, 1]} isMultiple>
        <AccordionItem label="Accordion Label 1">
          This is an accordion item
        </AccordionItem>
        <AccordionItem label="Accordion Label 2">
          This is an accordion item
        </AccordionItem>
      </Accordion>,
    )

    const buttons = await findAllByRole("button")
    buttons.forEach((element) => {
      expect(element).toHaveAttribute("aria-expanded", "true")
    })
  })

  test("should render a disabled item", async () => {
    const { findByTestId } = render(
      <Accordion>
        <AccordionItem
          data-testid="accordion-item"
          isDisabled
          label="Accordion Label 1"
        >
          This is an accordion item
        </AccordionItem>
      </Accordion>,
    )

    const accordionItem = await findByTestId("accordion-item")
    const button = accordionItem.querySelector("button")
    expect(button!).toHaveAttribute("disabled")
  })

  test("should render item with panel", async () => {
    const { findByTestId } = render(
      <Accordion>
        <AccordionItem label="Item">
          <AccordionPanel
            data-testid="accordion-panel"
            pt={3}
            bg={["orange.50", "orange.400"]}
          >
            This is an accordion item
          </AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )

    const panel = await findByTestId("accordion-panel")
    expect(panel).toBeInTheDocument()
  })

  test("should render item with custom icon", async () => {
    const { findByTestId, user } = render(
      <Accordion
        icon={({ isExpanded }) => (
          <Icon
            data-testid="custom-icon"
            icon={!isExpanded ? faPlus : faMinus}
            color={["blackAlpha.800", "whiteAlpha.700"]}
          />
        )}
      >
        <AccordionItem data-testid="accordion-item" label="item">
          This is an accordion item
        </AccordionItem>
      </Accordion>,
    )
    const customIcon = await findByTestId("custom-icon")
    expect(customIcon).toHaveAttribute("data-icon", "plus")

    // toggle the accordion item
    const button = (await findByTestId("accordion-item")).querySelector(
      "button",
    )
    await user.click(button!)
    expect(customIcon).toHaveAttribute("data-icon", "minus")
  })

  test("should render item with custom label", async () => {
    const { findByTestId } = render(
      <Accordion>
        <AccordionItem>
          <AccordionLabel
            data-testid="accordion-label"
            _expanded={{ bg: "orange.500", color: "white" }}
          >
            Custom Label
          </AccordionLabel>

          <AccordionPanel pt={3}>This is an accordion item</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    )
    const accordionLabel = await findByTestId("accordion-label")
    expect(accordionLabel).toBeInTheDocument()
  })
})
