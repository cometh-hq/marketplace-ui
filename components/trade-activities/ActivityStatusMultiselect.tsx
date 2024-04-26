import { useCallback, useMemo } from "react"
import { TradeStatus } from "@cometh/marketplace-sdk"
import Select from "react-select"

import { cn } from "@/lib/utils/utils"
import MULTISELECT_CLASSNAMES from "@/styles/multiSelectClassNames"

export type TradeStatusOption = {
  value: TradeStatus
  label: string
}

const ORDER_STATUS_OPTIONS: TradeStatusOption[] = [
  { value: TradeStatus.OPEN, label: "Open" },
  { value: TradeStatus.FILLED, label: "Filled" },
  { value: TradeStatus.CANCELLED, label: "Cancelled" },
  { value: TradeStatus.CANCELLED_BY_TRANSFER, label: "Cancelled by transfer" },
  { value: TradeStatus.EXPIRED, label: "Expired" },
]

type ActivityStatusMultiselectProps = {
  onValueChange: (selectedStatuses: TradeStatus[]) => void
  selectedStatuses: TradeStatus[]
  possibleStatuses?: TradeStatus[]
}

export const ActivityStatusMultiselect = ({
  onValueChange,
  selectedStatuses,
  possibleStatuses = [
    TradeStatus.OPEN,
    TradeStatus.FILLED,
    TradeStatus.CANCELLED,
    TradeStatus.CANCELLED_BY_TRANSFER,
    TradeStatus.EXPIRED,
  ],
}: ActivityStatusMultiselectProps) => {
  const filteredOptions = useMemo(() => {
    return ORDER_STATUS_OPTIONS.filter((option) =>
      possibleStatuses.includes(option.value)
    )
  }, [possibleStatuses])

  const onChange = useCallback(
    (selectedStatuses: readonly TradeStatusOption[] | null) => {
      onValueChange(selectedStatuses?.map((status) => status.value) ?? [])
    },
    [onValueChange]
  )

  const selectedOptions = useMemo(() => {
    return selectedStatuses.map((status) => {
      return ORDER_STATUS_OPTIONS.find((option) => option.value === status)
    }) as TradeStatusOption[]
  }, [selectedStatuses])

  return (
    <Select
      isMulti
      options={filteredOptions}
      placeholder="Select order status"
      onChange={onChange}
      value={selectedOptions}
      classNames={MULTISELECT_CLASSNAMES as any}
    />
  )
}
