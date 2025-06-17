"use client";

export default function EnvTest() {
  return (
    <div>
      <p>Endpoint: {process.env.NEXT_PUBLIC_PUBLIC_KEY}</p>
    </div>
  );
}
