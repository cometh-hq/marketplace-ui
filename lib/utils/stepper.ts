import { useCallback, useMemo, useState } from "react"

export type StepperOptions<T> = {
  steps: T[] | null | undefined
}

export const useStepper = <T>({ steps }: StepperOptions<T>) => {
  const [index, setIndex] = useState(0)

  const previousStep = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [setIndex])

  const nextStep = useCallback(() => {
    if (!steps) return
    setIndex((i) => Math.min(steps.length - 1, i + 1))
  }, [setIndex, steps])

  const reset = useCallback(() => {
    setIndex(0)
  }, [setIndex])

  const currentStep = useMemo(() => steps?.[index], [index, steps])

  return {
    currentStep,
    previousStep,
    nextStep,
    index,
    reset,
  }
}
