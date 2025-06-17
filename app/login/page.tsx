"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import React, { useState } from 'react'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        if (result?.error) {
            alert(result.error);
        }else {
            router.push("/");
            return NextResponse.json(
                { message: "User Login successfully" },
                { status: 201 }
            );
        }
    };
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
        <div>
            <p>Dont have an account? <a href="/register">Register</a></p>
        </div>
    </div>
  )
}

export default LoginPage