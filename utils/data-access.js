"use server"

import { 
  createDirectus, 
  authentication, 
  rest, 
  login, 
  withToken, 
  readMe, 
  updateItem 
} from '@directus/sdk';
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import{ AUTH_USER, COOKIE_NAME } from "@/utils/constants"

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(authentication("cookie", {credentials: "include", autoRefresh: true}))
  .with(rest({credentials: "include"}));

export const createSession = async (email, password) => {
  try {
    const session = await directus.login(email, password)
    const formattedData = JSON.stringify(session)
    cookies().set(COOKIE_NAME, formattedData)
    return { session }
  } catch (err) {
    return { errors: err.errors }
  }
} 

export const deleteSession = async () => {
  cookies().delete(AUTH_USER);
  cookies().delete(COOKIE_NAME);
};

export const userSession = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    const token = JSON.parse(cookie?.value);
    const user = {
      accessToken: token?.access_token,
      expiresAt: token?.expires_at
    }

    return user;
  } catch {
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
