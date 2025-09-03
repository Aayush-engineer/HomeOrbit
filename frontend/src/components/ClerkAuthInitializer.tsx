"use client";

import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { setClerkAuth } from "@/state/clerkSlice";
import { transformUser } from "@/lib/transformUser";
import { jwtDecode } from "jwt-decode";

const ClerkAuthInitializer = () => {
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth(); // ✅ here
  console.log("i am also hit first");

  useEffect(() => {
    const syncClerk = async () => {
      if (isLoaded && user) {
        const token = await getToken({ template: "role-based-access-control" });
        if (!token) return; 
        const role = user.unsafeMetadata?.role as string;
        dispatch(setClerkAuth({ user: transformUser(user), token, role }));
      }
    };

    syncClerk();
  }, [user, isLoaded, getToken, dispatch]);

  return null;
};

export default ClerkAuthInitializer;
