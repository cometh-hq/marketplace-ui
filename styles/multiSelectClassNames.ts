import { ClassNamesConfig } from "react-select"

import { cn } from "@/lib/utils/utils"

const MULTISELECT_CLASSNAMES: ClassNamesConfig = {
  control: (state) =>
    cn("border-input bg-background overflow-hidden rounded-md"),
  valueContainer: (state) => cn("text-primary bg-background rounded-md"),
  indicatorsContainer: (state) => cn("text-primary bg-background rounded-md"),
  input: (state) => cn("text-primary bg-background "),

  multiValue: (state) => cn("text-primary bg-muted overflow-hidden rounded-md"),
  multiValueLabel: (state) => cn("text-primary bg-muted"),
  multiValueRemove: (state) => cn("bg-muted text-primary"),

  menu: (state) => cn("text-primary bg-background border-red rounded-md "),
  menuList: (state) => cn("text-primary bg-background rounded-md"),
  menuPortal: (state) => cn("text-primary bg-background rounded-md"),
  option: ({ isDisabled, isFocused, isSelected }) =>
    cn(isFocused ? "bg-muted" : "bg-background"),

  clearIndicator: (state) => cn("text-primary bg-background"),
  dropdownIndicator: (state) => cn("text-primary bg-background"),
  indicatorSeparator: (state) => cn("bg-muted"),

  placeholder: (state) => cn("text-muted-foreground bg-background"),
  singleValue: (state) => cn("text-primary bg-background"),

  container: (state) => cn("text-primary bg-background"),
  group: (state) => cn("text-primary bg-background"),
  groupHeading: (state) => cn("text-primary bg-background"),
  loadingIndicator: (state) => cn("text-primary bg-background"),
  loadingMessage: (state) => cn("text-primary bg-background"),
  noOptionsMessage: (state) => cn("text-primary bg-background"),
}

export default MULTISELECT_CLASSNAMES
