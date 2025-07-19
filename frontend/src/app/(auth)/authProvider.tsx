"use client";

import { useEffect } from "react";
import { useUser, SignIn, SignUp } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/signin", "/signup"];

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = publicRoutes.includes(pathname);
  const isProtectedPage = !isAuthPage;

  
  useEffect(() => {
    if (!isLoaded) return;

   
    if (isSignedIn && isAuthPage) {
      router.push("/");
    }

    if (!isSignedIn && isProtectedPage) {
      router.push("/signin");
    }
  }, [isSignedIn, isAuthPage, isProtectedPage, isLoaded, router]);

  
  if (!isLoaded) return null;

  
  if (pathname === "/signin") return <SignIn />;
  if (pathname === "/signup") return <SignUp />;

  return <>{children}</>;
};

export default Auth;
