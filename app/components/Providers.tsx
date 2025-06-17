"use client";
import { ImageKitProvider } from "@imagekit/next"; 
import { SessionProvider } from "next-auth/react";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!urlEndpoint) {
    console.error("ImageKit urlEndpoint is missing.");
    return <>{children}</>; // fallback to render children at least
  }

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}
