import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { deleteSession } from "@/lib/data-access"

export async function GET() {
  await deleteSession()
  console.log("deleted session!")
  revalidatePath("/", "layout");
  return redirect("/")
}