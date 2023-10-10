import { ReactElement } from "react"

export type SwitchProps<T> = {
  value: T
  children: ReactElement<CaseProps<T>>[]
}

export type CaseProps<T> = {
  value: T | "default"
  children: React.ReactNode[] | React.ReactNode
}

export function Case<T>({ children }: CaseProps<T>) {
  return <>{children}</>
}

export function Switch<T>({ children, value }: SwitchProps<T>) {
  const child = children.find(
    (child) => child.props.value === value || child.props.value === "default"
  )
  return <>{child ?? null}</>
}
