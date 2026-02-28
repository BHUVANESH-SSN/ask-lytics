import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Check if the user exists
        const user = await db.user.findUnique({
            where: { email },
        });

        // 2. We don't want to expose if a user exists or not, so we always return a success message
        // even if the user isn't found. This prevents user enumeration padding attacks.
        if (!user) {
            return NextResponse.json(
                { message: "If your email is registered, you will receive a reset link shortly." },
                { status: 200 }
            );
        }

        // 3. Generate a secure token
        const token = await generatePasswordResetToken(email);

        // 4. Send the email with the token link
        await sendPasswordResetEmail(user.email, token);

        return NextResponse.json(
            { message: "If your email is registered, you will receive a reset link shortly." },
            { status: 200 }
        );
    } catch (error) {
        console.error("[FORGOT_PASSWORD_EMAIL]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
