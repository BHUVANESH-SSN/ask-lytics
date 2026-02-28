import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { mobile, otp, password } = await req.json();

        if (!mobile || !otp || !password) {
            return NextResponse.json(
                { error: "Mobile, OTP, and new password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }

        // 1. Find user and verify OTP exists and hasn't expired.
        // The query logic checks that `resetPasswordOTPExpires` is greater than the current time `new Date()`
        const user = await db.user.findFirst({
            where: {
                mobile: mobile,
                resetPasswordOTP: otp,
                resetPasswordOTPExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // 2. Hash the new password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Update the user record.
        // We update the password_hash entirely, and we nullify the reset OTP fields
        // so this specific OTP can NEVER be reused.
        await db.user.update({
            where: { id: user.id },
            data: {
                password_hash: hashedPassword,
                resetPasswordOTP: null,
                resetPasswordOTPExpires: null,
            },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("[RESET_PASSWORD_MOBILE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
