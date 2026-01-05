import { syncUser } from "@/lib/syncUser";
export default async function Home() {
  const user = await syncUser();
  console.log(user)
  return (
  
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>home</h1>

    </div>
  );
}
