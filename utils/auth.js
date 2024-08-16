import { COOKIE_NAME } from "@/utils/constants";
import { cookies } from "next/headers";

export const createSession = async (credentials) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  const user = await res.json();
  // If no error and we have user data, return it
  if (!res.ok && user) {
    throw new Error("Wrong credentials!");
  }

  console.log({user})
  const formattedData = JSON.stringify(user)
  cookies().set(COOKIE_NAME, formattedData)
  return user;
};