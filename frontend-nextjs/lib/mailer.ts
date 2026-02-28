import nodemailer from "nodemailer";

// In a real application, you would configure these environment variables
// to use a provider like SendGrid, AWS SES, Resend, or your company's SMTP.
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

/**
 * Sends a password reset email to a specific address with a reset link.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Log the link in development so you don't actually have to set up SMTP
    // to click it and test it locally right now.
    if (process.env.NODE_ENV !== "production") {
        console.log("==========================================");
        console.log(`[LOCAL DEV] Password reset link for ${email}:`);
        console.log(resetLink);
        console.log("==========================================");
        // return; // Skip actually trying to send it to avoid errors if SMTP isn't setup
    }

    // Sends the real email in production
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@asklytics.com",
        to: email,
        subject: "Reset your password",
        html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
    });
}

/**
 * Mocks sending an OTP via SMS. Real integration might use Twilio or MessageBird.
 */
export async function sendPasswordResetOTP(mobile: string, otp: string) {
    // In development, just log the OTP to the console so you can test it locally.
    if (process.env.NODE_ENV !== "production") {
        console.log("==========================================");
        console.log(`[LOCAL DEV] Password reset OTP for +91 ${mobile}:`);
        console.log(`Your code is: ${otp}`);
        console.log("==========================================");
        return;
    }

    // Example: twilioClient.messages.create({ ... })
    console.log(`Sending SMS to ${mobile} with OTP ${otp}...`);
}
