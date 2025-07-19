"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Auth from "./(auth)/authProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
      <ClerkProvider
      appearance={{ baseTheme: dark }} 
    >
        <Auth>{children}</Auth>
      </ClerkProvider>
  );
};

export default Providers;
