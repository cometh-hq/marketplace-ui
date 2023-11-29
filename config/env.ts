import { z } from "zod"

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_BASE_PATH: z.string(),
  NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS: z.string().min(1),

  // Cometh
  NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL: z.string().url(),
  NEXT_PUBLIC_MARKETPLACE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_COMETH_CONNECT_API_KEY: z.string().min(1).optional(),
})

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * edge runtimes (e.g. middlewares) or client-side so we need to destruct manually.
 */
const processEnv: Record<
  keyof z.infer<typeof server> | keyof z.infer<typeof client>,
  string | undefined
> = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS,
  NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL:
    process.env.NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL,
  NEXT_PUBLIC_MARKETPLACE_API_KEY: process.env.NEXT_PUBLIC_MARKETPLACE_API_KEY,
  NEXT_PUBLIC_COMETH_CONNECT_API_KEY:
    process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
}

// Don't touch the part below
// --------------------------

const merged = server.merge(client)
/** @type z.infer<merged>
 *  @ts-ignore - can't type this properly in jsdoc */
let env: z.infer<typeof merged> = process.env

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined"

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv) // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    )
    throw new Error("Invalid environment variables")
  }

  /** @type z.infer<merged>
   *  @ts-ignore - can't type this properly in jsdoc */
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        )
      /*  @ts-ignore - can't type this properly in jsdoc */
      return target[prop]
    },
  })
}

export { env }
