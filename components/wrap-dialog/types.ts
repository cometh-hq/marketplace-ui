import { z } from "zod"

export const WrapFormSchema = z.object({
  amount: z.string().min(1),
})

export type WrapFormValues = z.infer<typeof WrapFormSchema>
