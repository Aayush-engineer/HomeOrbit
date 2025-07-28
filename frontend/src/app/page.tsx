'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const role = user?.unsafeMetadata.role as string;
  console.log("role is",role);

  if(user){
    return (
      <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome {user.username} the role is {role}</h1>
    </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
    </div>
  );
}
