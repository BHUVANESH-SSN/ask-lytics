import crypto from "crypto";
import { db } from "./db";

/**
 * Generates a secure, random token, saves it to the database with a 1-hour expiry,
 * and returns the raw token to be sent to the user.
 */
export async function generatePasswordResetToken(email: string) {
    // 1. Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // 2. Set expiry to 1 hour from now
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour in MS

    // 3. Save the token to the database
    // Note: We don't hash the reset token in the DB here for simplicity of matching the URL,
    // but in very strict environments you could store a hashed version of the token.
    await db.user.update({
        where: { email },
        data: {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        },
    });

    return token;
}

/**
 * Generates a 6-digit numeric OTP, saves it to the database with a 15-minute expiry,
 * and returns the OTP to be sent via SMS.
 */
export async function generatePasswordResetOTP(mobile: string) {
    // 1. Generate a 6-digit numeric string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set expiry to 15 minutes from now
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins in MS

    // 3. Save to database
    await db.user.update({
        where: { mobile },
        data: {
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: expires,
        },
    });

    return otp;
}
