"use client";

import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { setClerkAuth } from "@/state/clerkSlice";
import { transformUser } from "@/lib/transformUser";

const ClerkAuthInitializer = () => {
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth(); // ✅ here

  useEffect(() => {
    const syncClerk = async () => {
      if (isLoaded && user) {
        const token = await getToken();
        if (!token) return; 
        console.log("this is my user",user);
        const role = user.unsafeMetadata?.role as string;
        dispatch(setClerkAuth({ user: transformUser(user), token, role }));
      }
    };

    syncClerk();
  }, [user, isLoaded, getToken, dispatch]);

  return null;
};

export default ClerkAuthInitializer;
