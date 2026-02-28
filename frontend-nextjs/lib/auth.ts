import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Redirect back to our custom login page if there's an issue
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (user.email) {
                    const existingUser = await db.user.findUnique({
                        where: { email: user.email }
                    });

                    if (!existingUser) {
                        // Create the OAuth user in the database
                        await db.user.create({
                            data: {
                                email: user.email,
                                name: user.name || "OAuth User",
                                // mobile and password_hash can be safely omitted now that they are optional
                            }
                        });
                    }
                }
                return true;
            } catch (error) {
                console.error("Error saving OAuth user:", error);
                return false; // Block sign-in if something goes wrong with DB
            }
        },
    }
};
