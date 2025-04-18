import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from "@directus/sdk"

export const directus = (token="") => {
  if (token) {
    return createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "")
      .with(staticToken(token))
      .with(rest())
  }
  return createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "")
    .with(
      authentication("cookie", { credentials: "include", autoRefresh: true })
    )
    .with(rest())
}

export const login = async ({
  email,
  password,
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    }
  )
  const user = await res.json()
  if (!res.ok && user) {
    throw new Error("Email address or password is invalid")
  }
  if (res.ok && user) {
    return user?.data
  }
}
