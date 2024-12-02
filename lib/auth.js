import { COOKIE_NAME } from "@/utils/constants";
import { cookies } from "next/headers";

export const directusLogin = async (credentials) => {
    const res = await fetch(`${process.env.DIRECTUS_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      const formattedData = JSON.stringify(data)
      cookies().set(COOKIE_NAME, formattedData)
    }
    return data;
};