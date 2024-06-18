import { Button } from "@yamada-ui/button"
import { a11y, act, render, screen } from "@yamada-ui/test"
import type { FC } from "react"
import { Carousel, CarouselSlide } from "../src"

const slidesContentArr = new Array(3).fill(0).map((_, id) => `Slide ${id + 1}`)

describe("<Carousel/>", () => {
  test("should pass a11y test", async () => {
    await a11y(
      <Carousel>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )
  })

  test.each<{
    orientation: "horizontal" | "vertical"
    expectedFlexDirection: "row" | "column"
  }>([
    { orientation: "horizontal", expectedFlexDirection: "row" },
    { orientation: "vertical", expectedFlexDirection: "column" },
  ])(
    "should render correctly when orientation is set",
    ({ orientation, expectedFlexDirection }) => {
      const { container } = render(
        <Carousel orientation={orientation}>
          {slidesContentArr.map((value) => (
            <CarouselSlide key={value}>{value}</CarouselSlide>
          ))}
        </Carousel>,
      )

      let sliders = container.querySelector(".ui-carousel__sliders__inner")
      expect(sliders).toBeVisible()

      expect(sliders!).toHaveStyle({ flexDirection: expectedFlexDirection })
    },
  )

  test("should render defaultSlide correctly", async () => {
    render(
      <Carousel defaultIndex={2}>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const thirdSlide = await screen.findByRole("group", { name: /3 of 3/i })
    expect(thirdSlide).toHaveAttribute("data-selected")
  })

  test("should render correctly slide when using control button", async () => {
    const { user } = render(
      <Carousel
        controlNextProps={{ icon: <span>Next slide</span> }}
        controlPrevProps={{
          icon: <span>Prev slide</span>,
        }}
      >
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const nextButton = await screen.findByRole("button", {
      name: /go to next slide/i,
    })
    await user.click(nextButton)

    const secondSlide = await screen.findByRole("group", { name: /2 of 3/i })
    expect(secondSlide).toHaveAttribute("data-selected")
    expect(secondSlide).toBeVisible()

    const prevButton = await screen.findByRole("button", {
      name: /go to previous slide/i,
    })
    await user.click(prevButton)

    const firstSlide = await screen.findByRole("group", { name: /1 of 3/i })
    expect(firstSlide).toHaveAttribute("data-selected")
    expect(firstSlide).toBeVisible()
  })

  test("should switch to correctly slide when click on indicator", async () => {
    const { user } = render(
      <Carousel>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const toLastSlideButton = await screen.findByRole("button", {
      name: /go to 3 slide/i,
    })
    await user.click(toLastSlideButton)

    const thirdSlide = await screen.findByRole("group", { name: /3 of 3/i })
    expect(thirdSlide).toHaveAttribute("data-selected")
  })

  test("should disabled next and prev button when looping is disabled", async () => {
    const { user } = render(
      <Carousel
        controlNextProps={{ icon: <span>Next slide</span> }}
        controlPrevProps={{
          icon: <span>Prev slide</span>,
        }}
        loop={false}
      >
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    // When first slide the prev button should be disabled
    const prevButton = await screen.findByRole("button", {
      name: /go to previous slide/i,
    })
    expect(prevButton).toBeDisabled()

    // Move to the last slide
    const toLastSlideButton = await screen.findByRole("button", {
      name: /go to 3 slide/i,
    })
    await user.click(toLastSlideButton)

    // When last slide the next button should be disabled
    const nextButton = await screen.findByRole("button", {
      name: /go to next slide/i,
    })
    expect(nextButton).toBeDisabled()
  })

  test("should not display control element when withControl is false", () => {
    render(
      <Carousel withControls={false}>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const nextSlideButton = screen.queryByRole("button", {
      name: /Prev slide/i,
    })
    const prevSlideButton = screen.queryByRole("button", {
      name: /Next slide/i,
    })
    expect(prevSlideButton).toBeNull()
    expect(nextSlideButton).toBeNull()
  })

  test("should not display indicators element when withIndicators is false", async () => {
    render(
      <Carousel withIndicators={false}>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const indicators = screen.queryAllByRole("button", {
      name: /go to [1-3] slide/i,
    })
    for (const indicator of indicators) {
      expect(indicator).toBeNull()
    }
  })

  test("should render function indicator correctly", async () => {
    const indicatorComponent: FC<{
      index: number
      isSelected: boolean
    }> = ({ index }) => {
      return <Button>{`test indicator ${index}`}</Button>
    }

    render(
      <Carousel indicatorsProps={{ component: indicatorComponent }}>
        {slidesContentArr.map((value) => (
          <CarouselSlide key={value}>{value}</CarouselSlide>
        ))}
      </Carousel>,
    )

    const indicators = await screen.findAllByRole("button", {
      name: /Go to [1-3] slide/i,
    })
    expect(indicators).toHaveLength(slidesContentArr.length)

    indicators.forEach((indicator) => expect(indicator).toBeVisible())
  })

  describe("With Timers", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test("should do not stop autoplay on mouse enter", async () => {
      const { user } = render(
        <Carousel delay={500} autoplay stopMouseEnterAutoplay={false}>
          {slidesContentArr.map((value) => (
            <CarouselSlide key={value}>{value}</CarouselSlide>
          ))}
        </Carousel>,
      )

      const firstSlide = await screen.findByRole("group", { name: /1 of 3/i })
      await user.click(firstSlide)

      act(() => {
        vi.advanceTimersByTime(1200)
      })

      const thirdSlide = await screen.findByRole("group", { name: /3 of 3/i })
      expect(thirdSlide).toHaveAttribute("data-selected")
    })

    test("should render correctly when using autoplay", async () => {
      const delayTimer = 500

      const carouselElement = (
        <Carousel autoplay delay={delayTimer}>
          {slidesContentArr.map((value) => (
            <CarouselSlide key={value}>{value}</CarouselSlide>
          ))}
        </Carousel>
      )

      render(carouselElement)

      // First after delay timer should be slide 2
      act(() => {
        vi.advanceTimersByTime(delayTimer)
      })

      const secondSlide = await screen.findByRole("group", { name: /2 of 3/i })
      expect(secondSlide).toHaveAttribute("data-selected")

      // Finally slide 3 must be have data-selected
      act(() => {
        vi.advanceTimersByTime(delayTimer)
      })

      const thirdSlide = await screen.findByRole("group", { name: /3 of 3/i })
      expect(thirdSlide).toHaveAttribute("data-selected")
    })

    test("should stop autoplay on mouse enter", async () => {
      const carouselElement = (
        <Carousel delay={500} autoplay stopMouseEnterAutoplay>
          {slidesContentArr.map((value) => (
            <CarouselSlide key={value}>{value}</CarouselSlide>
          ))}
        </Carousel>
      )

      const { user } = render(carouselElement)
      const firstSlide = await screen.findByRole("group", { name: /1 of 3/i })

      await user.click(firstSlide)

      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(firstSlide).toHaveAttribute("data-selected")
    })
  })
})
