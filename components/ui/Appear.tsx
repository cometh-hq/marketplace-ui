import React, { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { animated, config, useSpring } from "react-spring"

export function useVisibility(when: boolean) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(when)
  }, [when])

  return visible
}

export function Appear({
  children,
  delay = 0,
  condition = true,
  enabled = true,
  ...props
}: {
  children: JSX.Element | false | null | undefined
  delay?: number
  condition?: boolean
  enabled?: boolean
  visible?: boolean
  className?: string
}) {
  const { ref: appearRef, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
    triggerOnce: true,
  })
  const [shouldAppear, setShouldAppear] = useState(false)
  useEffect(() => {
    if (inView && condition) {
      setShouldAppear(true)
    }
  }, [inView, condition])
  const spring = useSpring({
    enter: {
      opacity: 0,
      transform: "translateY(50px)",
    },
    to: {
      opacity: shouldAppear ? 1 : 0,
      transform: shouldAppear ? "translateY(0)" : "translateY(50px)",
    },
    delay: delay,
    config: { ...config.wobbly, friction: 20 },
  })

  return (
    <>
      <animated.div {...props} style={enabled ? spring : {}} ref={appearRef}>
        {children ?? null}
      </animated.div>
    </>
  )
}
