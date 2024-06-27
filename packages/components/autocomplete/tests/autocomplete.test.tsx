import type { AutocompleteItem } from "@yamada-ui/react"
import {
  Autocomplete,
  AutocompleteOption,
  AutocompleteOptionGroup,
} from "@yamada-ui/react"
import { act, render, screen, waitFor } from "@yamada-ui/test"

describe("<Autocomplete />", () => {
  const AUTOCOMPLETE_CLASS = ".ui-autocomplete"
  const AUTOCOMPLETE_ITEM_ROLE = "autocomplete-item"

  describe("renders correctly", () => {
    const ITEMS: AutocompleteItem[] = [
      {
        label: "option1",
        value: "option1",
      },
      {
        label: "option2",
        value: "option2",
      },
      {
        label: "option3",
        value: "option3",
      },
    ]

    test("default", async () => {
      const { user, container } = render(
        <Autocomplete placeholder="Select Option">
          <AutocompleteOption value="option1">option1</AutocompleteOption>
          <AutocompleteOption value="option2">option2</AutocompleteOption>
          <AutocompleteOption value="option3">option3</AutocompleteOption>
        </Autocomplete>,
      )

      expect(screen.getByRole("combobox")).toHaveAttribute(
        "placeholder",
        "Select Option",
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      await waitFor(() => {
        const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
        expect(optionElements).toHaveLength(3)
      })
    })

    test("with group label", async () => {
      const { user, container } = render(
        <Autocomplete>
          <AutocompleteOptionGroup label="Group1">
            <AutocompleteOption value="option1">option1</AutocompleteOption>
          </AutocompleteOptionGroup>
          <AutocompleteOptionGroup label="Group2">
            <AutocompleteOption value="option2">option2</AutocompleteOption>
          </AutocompleteOptionGroup>
          <AutocompleteOptionGroup label="Group3">
            <AutocompleteOption value="option3">option3</AutocompleteOption>
          </AutocompleteOptionGroup>
        </Autocomplete>,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      await waitFor(() => {
        const groupLabels = screen.getAllByText(/Group\d/)
        groupLabels.forEach((g) => {
          expect(g).toBeVisible()
        })
      })
    })

    test.each(["xs", "sm", "md", "lg"])(`with size prop %s`, (size) => {
      const { container } = render(<Autocomplete size={size} items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      expect(autocomplete).toHaveStyle(`font-size: var(--ui-fontSizes-${size})`)
    })

    test("with default value", () => {
      render(<Autocomplete defaultValue="option1" items={ITEMS} />)

      expect(screen.getByRole("combobox")).toHaveValue("option1")
    })

    test("with disabled", () => {
      render(<Autocomplete isDisabled items={ITEMS} />)

      expect(screen.getByRole("combobox")).toBeDisabled()
    })

    test("with readOnly", () => {
      render(<Autocomplete isReadOnly items={ITEMS} />)

      expect(screen.getByRole("combobox")).toHaveAttribute("readonly")
    })

    test("with invalid", () => {
      render(<Autocomplete isInvalid items={ITEMS} />)

      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-invalid",
        "true",
      )
    })

    test("with emptyProps icon", async () => {
      const { user, container } = render(
        <Autocomplete
          emptyProps={{ icon: <svg data-testid="icon" /> }}
          items={ITEMS}
        />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      await waitFor(() => {
        expect(screen.getByTestId("icon")).toBeInTheDocument()
      })
    })
  })

  describe("select options", () => {
    const ITEMS: AutocompleteItem[] = [
      {
        label: "option1",
        value: "option1",
      },
      {
        label: "option2",
        value: "option2",
      },
      {
        label: "option3",
        value: "option3",
      },
    ]

    test("select the first option when clicked", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await user.click(optionElements[0])

      await waitFor(() =>
        expect(screen.getByRole("combobox")).toHaveValue("option1"),
      )
    })

    test("update the value when typing in the combobox", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, "option2")
      await user.keyboard("{Enter>}")

      expect(input).toHaveValue("option2")
    })

    test("should be searchable in uppercase and full-width characters", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, "ＯＰＴＩＯＮ２")
      await user.keyboard("{Enter>}")

      expect(input).toHaveValue("option2")
    })

    test("display 'No results found' when selecting a non-existent option", async () => {
      const NO_RESULTS = "No results found"
      const { user, container } = render(
        <Autocomplete emptyMessage={NO_RESULTS} items={ITEMS} />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      expect(screen.getByText(NO_RESULTS)).toHaveStyle("position: absolute")

      await user.type(screen.getByRole("combobox"), "option4")
      expect(screen.getByText(NO_RESULTS)).not.toHaveStyle("position: absolute")
    })

    test("does not close the dropdown list when an option is selected", async () => {
      const { user, container } = render(
        <Autocomplete closeOnSelect={false} items={ITEMS} />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await user.click(optionElements[0])

      optionElements.forEach((o) => {
        expect(o).toBeVisible()
      })
    })

    test("does not close the dropdown list when blurred", async () => {
      const { user, container } = render(
        <>
          <input type="text" placeholder="focus-other" />
          <Autocomplete closeOnBlur={false} items={ITEMS} />
        </>,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      act(() => {
        screen.getByPlaceholderText("focus-other").focus()
      })

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      optionElements.forEach((o) => {
        expect(o).toBeVisible()
      })
    })
  })

  describe("keyDown event", () => {
    const ITEMS: AutocompleteItem[] = [
      {
        label: "option1",
        value: "option1",
      },
      {
        label: "option2",
        value: "option2",
      },
      {
        label: "option3",
        value: "option3",
      },
    ]

    test("arrowDown keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{ArrowDown>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)

      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )

      for (let i = 1; i < ITEMS.length; i++) {
        await user.keyboard("{ArrowDown>}")

        await waitFor(() =>
          expect(optionElements[i]).toHaveAttribute("data-focus"),
        )
      }

      await user.keyboard("{ArrowDown>}")

      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )
    })

    test("arrowDown keyDown should work correctly even when defaultValue is set", async () => {
      const { user, container } = render(
        <Autocomplete items={ITEMS} defaultValue="option2" />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{ArrowDown>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[1]).toHaveAttribute("data-focus"),
      )
    })

    test("arrowUp keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{ArrowUp>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)

      await waitFor(() =>
        expect(optionElements[ITEMS.length - 1]).toHaveAttribute("data-focus"),
      )

      for (let i = ITEMS.length - 2; i >= 0; i--) {
        await user.keyboard("{ArrowUp>}")

        await waitFor(() =>
          expect(optionElements[i]).toHaveAttribute("data-focus"),
        )
      }

      await user.keyboard("{ArrowUp>}")

      await waitFor(() =>
        expect(optionElements[ITEMS.length - 1]).toHaveAttribute("data-focus"),
      )
    })

    test("arrowUp keyDown should work correctly even when defaultValue is set", async () => {
      const { user, container } = render(
        <Autocomplete items={ITEMS} defaultValue="option2" />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{ArrowUp>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[1]).toHaveAttribute("data-focus"),
      )
    })

    test("space keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{Space>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )

      await user.keyboard("{Space>}")

      const input = screen.getByRole("combobox")
      await waitFor(() => expect(input).toHaveValue("option1"))
    })

    test("space keyDown should be able to create options", async () => {
      const { user, container } = render(
        <Autocomplete allowCreate items={ITEMS} />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, "option4")
      await user.keyboard("{Space>}")

      await waitFor(() => {
        const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
        expect(optionElements[0]).toHaveTextContent("option4")
      })
    })

    test("enter keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{Enter>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )

      await user.keyboard("{Enter>}")

      const input = screen.getByRole("combobox")
      await waitFor(() => expect(input).toHaveValue("option1"))
    })

    test("enter keyDown should be able to create options", async () => {
      const { user, container } = render(
        <Autocomplete allowCreate items={ITEMS} />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, "option4")
      await user.keyboard("{Enter>}")

      await waitFor(() => {
        const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
        expect(optionElements[0]).toHaveTextContent("option4")
      })
    })

    test("home keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)
      await user.keyboard("{Escape>}{ArrowUp>}")

      const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)

      await waitFor(() =>
        expect(optionElements[ITEMS.length - 1]).toHaveAttribute("data-focus"),
      )

      await user.keyboard("{Home>}")

      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )
    })

    test("end keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )

      await user.keyboard("{End>}")
      await waitFor(() =>
        expect(optionElements[optionElements.length - 1]).toHaveAttribute(
          "data-focus",
        ),
      )
    })

    test("escape keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const select = await screen.findByRole("select")
      await waitFor(() => expect(select).toHaveStyle({ visibility: "visible" }))

      await user.keyboard("{Escape>}")
      await waitFor(() => expect(select).toHaveStyle({ visibility: "hidden" }))
    })

    test("backspace keyDown should work correctly", async () => {
      const { user, container } = render(<Autocomplete items={ITEMS} />)

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      await waitFor(() =>
        expect(optionElements[0]).toHaveAttribute("data-focus"),
      )

      const input = screen.getByRole("combobox")

      await user.keyboard("{Enter>}{Enter>}")
      await waitFor(() => expect(input).toHaveValue("option1"))

      await user.keyboard("{Backspace>}")
      await waitFor(() => expect(input).not.toHaveValue())
    })
  })

  describe("create option", () => {
    const GROUP_LABEL = "Group2"
    const CREATE_OPTION_VALUE = "option4"
    const items: AutocompleteItem[] = [
      {
        label: "option1",
        value: "option1",
      },
      {
        label: GROUP_LABEL,
        items: [
          {
            label: "option2",
            value: "option2",
          },
        ],
      },
      {
        label: "option3",
        value: "option3",
      },
    ]

    test("create option when no options are available", async () => {
      const { user, container } = render(
        <Autocomplete allowCreate items={items} />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, CREATE_OPTION_VALUE)
      await user.keyboard("{Enter>}")

      await waitFor(() => {
        const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
        expect(optionElements[0]).toHaveTextContent(CREATE_OPTION_VALUE)
      })
    })

    test("correct warnings should be issued when both `allowCreate` and `children` are present", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})

      render(
        <Autocomplete allowCreate>
          <AutocompleteOption value="option1">option1</AutocompleteOption>
          <AutocompleteOption value="option2">option2</AutocompleteOption>
          <AutocompleteOption value="option3">option3</AutocompleteOption>
        </Autocomplete>,
      )

      expect(consoleWarnSpy).toHaveBeenCalledOnce()

      consoleWarnSpy.mockRestore()
    })

    describe("with insert position", () => {
      test("first", async () => {
        const { user, container } = render(
          <Autocomplete allowCreate items={items} insertPositionItem="first" />,
        )

        const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
        expect(autocomplete).toBeInTheDocument()

        await user.click(autocomplete!)

        const input = screen.getByRole("combobox")
        await user.type(input, CREATE_OPTION_VALUE)
        await user.keyboard("{Enter>}")

        await waitFor(() => {
          const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
          expect(optionElements[0]).toHaveTextContent(CREATE_OPTION_VALUE)
        })
      })

      test("last", async () => {
        const { user, container } = render(
          <Autocomplete allowCreate items={items} insertPositionItem="last" />,
        )

        const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
        expect(autocomplete).toBeInTheDocument()

        await user.click(autocomplete!)

        const input = screen.getByRole("combobox")
        await user.type(input, CREATE_OPTION_VALUE)
        await user.keyboard("{Enter>}")

        await waitFor(() => {
          const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
          expect(optionElements[optionElements.length - 1]).toHaveTextContent(
            CREATE_OPTION_VALUE,
          )
        })
      })

      test("group2", async () => {
        const { user, container } = render(
          <Autocomplete
            allowCreate
            items={items}
            insertPositionItem={GROUP_LABEL}
          />,
        )

        const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
        expect(autocomplete).toBeInTheDocument()

        await user.click(autocomplete!)

        const input = screen.getByRole("combobox")
        await user.type(input, CREATE_OPTION_VALUE)
        await user.keyboard("{Enter>}")

        await waitFor(() => {
          const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
          expect(optionElements[1]).toHaveTextContent(CREATE_OPTION_VALUE)
        })
      })

      test("group2 last", async () => {
        const { user, container } = render(
          <Autocomplete
            allowCreate
            items={items}
            insertPositionItem={[GROUP_LABEL, "last"]}
          />,
        )

        const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
        expect(autocomplete).toBeInTheDocument()

        await user.click(autocomplete!)

        const input = screen.getByRole("combobox")
        await user.type(input, CREATE_OPTION_VALUE)
        await user.keyboard("{Enter>}")

        await waitFor(() => {
          const optionElements = screen.getAllByRole(AUTOCOMPLETE_ITEM_ROLE)
          expect(optionElements[2]).toHaveTextContent(CREATE_OPTION_VALUE)
        })
      })

      test("correct warnings should be  issued when insertPosition does not exist", async () => {
        const consoleWarnSpy = vi
          .spyOn(console, "warn")
          .mockImplementation(() => {})

        const { user, container } = render(
          <Autocomplete
            allowCreate
            items={items}
            insertPositionItem="Group4"
          />,
        )

        const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
        expect(autocomplete).toBeInTheDocument()

        await user.click(autocomplete!)

        const input = screen.getByRole("combobox")
        await user.type(input, CREATE_OPTION_VALUE)
        await user.keyboard("{Enter>}")

        await waitFor(() => expect(consoleWarnSpy).toHaveBeenCalledOnce())

        consoleWarnSpy.mockRestore()
      })
    })

    test("original list is not affected", async () => {
      const original: AutocompleteItem[] = [
        {
          label: "option1",
          value: "option1",
        },
        {
          label: GROUP_LABEL,
          items: [
            {
              label: "option2",
              value: "option2",
            },
          ],
        },
        {
          label: "option3",
          value: "option3",
        },
      ]

      const items: AutocompleteItem[] = JSON.parse(JSON.stringify(original))

      const { user, container } = render(
        <Autocomplete
          allowCreate
          items={items}
          insertPositionItem={GROUP_LABEL}
        />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, CREATE_OPTION_VALUE)
      await user.keyboard("{Enter>}")

      const optionElements = await screen.findAllByRole(AUTOCOMPLETE_ITEM_ROLE)
      expect(optionElements[1]).toHaveTextContent(CREATE_OPTION_VALUE)

      expect(items).toStrictEqual(original)
    })

    test("with createProps icon", async () => {
      const { user, container } = render(
        <Autocomplete
          allowCreate
          items={items}
          createProps={{
            icon: <svg data-testid="icon" />,
          }}
        />,
      )

      const autocomplete = container.querySelector(AUTOCOMPLETE_CLASS)
      expect(autocomplete).toBeInTheDocument()

      await user.click(autocomplete!)

      const input = screen.getByRole("combobox")
      await user.type(input, CREATE_OPTION_VALUE)
      await user.keyboard("{Enter>}")

      await waitFor(() => {
        expect(screen.getByTestId("icon")).toBeInTheDocument()
      })
    })
  })
})
