import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generatePasswordResetOTP } from "@/lib/tokens";
import { sendPasswordResetOTP } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();

        if (!mobile) {
            return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
        }

        // 1. Check if the user exists
        const user = await db.user.findUnique({
            where: { mobile },
        });

        // 2. Do not expose if a user exists
        if (!user) {
            return NextResponse.json(
                { message: "If your mobile number is registered, you will receive an OTP shortly." },
                { status: 200 }
            );
        }

        // 3. Generate a 6-digit OTP
        const otp = await generatePasswordResetOTP(mobile);

        // 4. Send the OTP via SMS (mocked in development)
        await sendPasswordResetOTP(user.mobile as string, otp);

        return NextResponse.json(
            { message: "If your mobile number is registered, you will receive an OTP shortly." },
            { status: 200 }
        );
    } catch (error) {
        console.error("[FORGOT_PASSWORD_MOBILE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
