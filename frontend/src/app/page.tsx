'use client';



import { useAppSelector } from "@/state/redux"; 

export default function Home() {
  
  const user = useAppSelector((state) => state.clerk.user);
  const role = useAppSelector((state) => state.clerk.role); 
  

  if(user){
    console.log("this is my user",user);
    return (
      <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome {user.email ?? "Guest"} the role is {role}</h1>
    </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
    </div>
  );
}
