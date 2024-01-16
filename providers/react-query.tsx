"use client"

import { useState } from "react"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { toast } from "@/components/ui/toast/use-toast"

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined) {
              toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: error.message,
              })
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.state.data !== undefined) {
              toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: error.message,
              })
            }
          },
        }),
        // mutationCache: new MutationCache({
        //   onError: (error, _variables, _context, mutation) => {
        //     if (mutation.options.onError) return;
        //       toast({
        //         variant: "destructive",
        //         title: "Something went wrong.",
        //         description: 'je suis une erreur en global ' + error.message,
        //       })

        //       // description: handleOrderbookError(error, {
        //       //   400: "Bad request",
        //       //   404: "Order not found",
        //       //   401: "Unauthorized",
        //       //   403: "Forbidden",
        //       //   500: "Internal orderbook server error",
        //       // }),
        //     }
        //   },
        // ),
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
