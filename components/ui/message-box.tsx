import { Info } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "./card"

export type MessageBoxProps = {
  title: string
  description: string
  renderIcon?: () => React.ReactNode
  className?: string
}

const MessageBox = ({
  title,
  description,
  renderIcon,
  className,
}: MessageBoxProps) => {
  return (
    <Card className={className}>
      <CardHeader className="py-0">
        <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
          {renderIcon?.()}
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export const InfoBox = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <MessageBox
      title={title}
      description={description}
      renderIcon={() => <Info size={20} />}
      className="border-0 p-0 shadow-none"
    />
  )
}
