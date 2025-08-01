'use client';



import Navbar from "@/components/Navbar";
import { useGetAuthUserQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux"; 

export default function Home() {
  
  const user = useAppSelector((state) => state.clerk.user);
  const role = useAppSelector((state) => state.clerk.role); 
  

  if(user){
    return (  
    <div className="h-full w-full ">
      <Navbar/>
      <div> Welcome {user.email ?? "Guest"} the role is {role}</div>
    </div>
    );
  }

  return (
    <div className="bg-slate-600 text-red-600 p-4">Tailwind Working?</div>
  );
}
