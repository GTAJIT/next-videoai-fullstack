// app/components/ImageKitProvider.tsx
"use client";

import { IKContext } from "imagekitio-react";

export default function ImageKitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const publicKey = process.env.NEXT_PUBLIC_PUCLIC_URI;
  return (
    <IKContext
      publicKey={publicKey} // Replace with your ImageKit public key
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      authenticationEndpoint="/api/imagekit-auth" // Optional, if you're using upload
    >
      {children}
    </IKContext>
  );
}