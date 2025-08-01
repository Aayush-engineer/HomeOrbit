"use client";

import StoreProvider from "@/state/redux";
import Auth from "./(auth)/authProvider";
import ClerkAuthInitializer from "@/components/ClerkAuthInitializer";

const Providers = ({ children }: { children: React.ReactNode }) => {

  return (
    <StoreProvider>
      <Auth>
        <ClerkAuthInitializer/>       
        {children}
      </Auth>
    </StoreProvider>
  );
};

export default Providers;
