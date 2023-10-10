import { z } from "zod"

export const UsernameFormSchema = z.object({
  username: z.string().min(2).max(50),
})

export type UsernameFormValues = z.infer<typeof UsernameFormSchema>
