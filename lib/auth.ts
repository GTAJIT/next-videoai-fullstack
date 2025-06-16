import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials){
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                try{
                    await dbConnect()
                    const user = await User.findOne({
                        email: credentials.email
                    })
                    if (!user) {
                        throw new Error("No user found with the given email");
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name || "User"
                    };
                } catch (error) {
                    console.error("Database connection error:", error);
                    throw new Error("Database connection failed");
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token.id = user.id;
                token.email = user.email;
                token.name = user.name || "User";
            }
            return token;
        },
        async session({ session, token }) {
            if(session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

