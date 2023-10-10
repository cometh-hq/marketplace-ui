import React from 'react'
import { animated, config, useSpring } from 'react-spring'
import { useIntersectionObserver } from 'usehooks-ts'

import { useEffect, useState } from 'react'

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
  const ref = React.useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(ref, {
    rootMargin: '0px',
    freezeOnceVisible: true,
  })
  const isInViewPort = !!entry?.isIntersecting
  const visible = useVisibility(condition && isInViewPort)

  const spring = useSpring({
    enter: {
      opacity: 0,
      transform: 'translateY(50px)',
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(50px)',
    },
    delay: delay,
    config: { ...config.wobbly, friction: 20 },
  })

  return (
    <animated.div {...props} style={enabled ? spring : {}} ref={ref}>
      {children ?? null}
    </animated.div>
  )
}
