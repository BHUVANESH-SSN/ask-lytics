import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and new password are required" },
                { status: 400 }
            );
        }

        // 1. Verify token exists and hasn't expired.
        // The query logic checks that `resetPasswordExpires` is greater than the current time `new Date()`
        const user = await db.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // 2. Hash the new password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Update the user record.
        // We update the password_hash entirely, and we nullify the reset token fields
        // so this specific token can NEVER be used again.
        await db.user.update({
            where: { id: user.id },
            data: {
                password_hash: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("[RESET_PASSWORD_EMAIL]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
