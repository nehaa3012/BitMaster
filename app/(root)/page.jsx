import { syncUser } from "@/lib/syncUser";
import HeroSection from "@/components/HeroSection";
export default async function Home() {
  const user = await syncUser();
  console.log(user)
  return (
  
    <div className="flex min-h-screen items-center justify-center font-sans ">
      <HeroSection/>

    </div>
  );
}
