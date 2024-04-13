import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// The middleware is providing a way for the Supabase client library to interact with cookies in the Next.js framework. 
// Supabase itself does not have built-in functionality to work with cookies in different frameworks or environments. 
// It relies on the developer to provide the necessary cookie handling logic specific to the framework or environment being used.
// createServerClient passes a cookies object to the Supabase client with get, set, remove methods to interact with NextJS cookies

// The client created in middleware.ts is specifically configured to handle cookies and user sessions. 
// It has custom methods for getting, setting, and removing cookies, which are used by the Supabase library 
// to manage user authentication sessions on the server-side.

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  await supabase.auth.getUser()

  return response
}