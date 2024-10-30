"use server"

import { 
  createDirectus, 
  authentication, 
  rest, 
  login,
  logout,
  refresh, 
  withToken, 
  readMe, 
  updateItem 
} from '@directus/sdk';
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import{ AUTH_USER, COOKIE_NAME } from "@/utils/constants"

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(authentication("json", {credentials: "include", autoRefresh: true}))
  .with(rest({credentials: "include"}));

let refreshTimeout = null

export const setCredentials = async (sessionData) => {
  const formattedData = JSON.stringify(sessionData)
  cookies().set(COOKIE_NAME, formattedData)

  if (refreshTimeout) { 
    clearTimeout(refreshTimeout)
  }

  refreshTimeout = setTimeout(async() => {
    refreshTimeout = null;
    await refreshSession()
  }, sessionData.expires - 3000)
}

export const createSession = async (email, password) => {
  try {
    const session = await directus.login(email, password)
    await setCredentials(session)
    return { session }
  } catch (err) {
    return { errors: err.errors }
  }
} 

export const refreshSession = async () => {
  try {
    console.log("refresh token!!")
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    const token = JSON.parse(cookie?.value);
    console.log({token})
    const session = await directus.request(refresh('json', token?.refresh_token))
    await setCredentials(session)
    return { session }
  } catch (err) {
    console.log("can't refresh token")
    console.log(err)
    return { errors: err.errors }
  }
} 


export const deleteSession = async () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  const token = JSON.parse(cookie?.value);
  await directus.request(logout(token?.refresh_token, 'json'))
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  cookies().delete(AUTH_USER);
  cookies().delete(COOKIE_NAME);
};

export const userSession = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    let session = JSON.parse(cookie?.value);

    const user = {
      accessToken: session?.access_token,
      expiresAt: session?.expires_at,
    }

    return user;
  } catch(err) {
    console.log(err)
    return { error: "Unauthorized" }
  }
};

export const currentUser = async (accessToken) => {
  try {
    const user = await directus.request(withToken(accessToken, 
      readMe({
        fields: ['*'],
      })
    ))
    console.log(user)
    return user
  } catch(err) {
    console.log(err)
    return null
  }
}
